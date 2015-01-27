class Widlib.Page

  constructor: (options) ->
    @session = options.session
    @extends = options.extends
    @setInnerValues() # не опускать ниже applyExtends
    @applyExtends()
    @rnd = Math.random()
    @proxyExtender =
      methods: {}
      signatures: []
      attributes:
        name: options.name
    _(@).extend options
    @localInner = _.chain(@localInner.concat @local).difference(@remote).uniq().value()
    @remoteInner = _.chain(@remoteInner.concat @remote).difference(@local).uniq().value()
    @setProxyExtender()
    @setSignatures @remoteInner

  applyExtends: ->
    @extends=_([@extends]).chain().flatten().compact().value() # force array
    _(@extends).each (name)=>
      @applyExtend name, @session.initPagesArr

  applyExtend: (name) ->
    arr = @session.initPagesArr # остаток изначального массива
    page = _(@session.pages).find (page) =>
      page.name == name
    if !page
      obj = _(arr).find (obj) =>
        obj.name == name
      page = @session.initPage _(arr).indexOf(obj)
    _(@).extendOwn _(page).omit 'localInner', 'remoteInner'
    @localInner = _.chain(@localInner.concat page.localInner).difference(page.remoteInner).uniq().value()
    @remoteInner = _.chain(@remoteInner.concat page.remoteInner).difference(page.localInner).uniq().value()

  setInnerValues: ->
    @localInner = ["onBind", "name", "onEnter", "onSubmit", "onLeave", "backStack", "template"]
    @remoteInner = []
    @local = []
    @remote = []

  setProxyExtender: ->
    @localInner = _.chain(@localInner.concat @local).difference(@remote).uniq().value()
    @remoteInner = _.chain(@remoteInner.concat @remote).difference(@local).uniq().value()
    @setLocal @localInner
    @setRemote @remoteInner

  onEnter:  true
  onBind:   true
  onSubmit: (options) -> options.to #_next, _current, _previous, name, undefined, true, false
  onLeave:  true
  onProxyRequest: true
  backStack: true

  enter: ->
    Q(_.result @, "onEnter")
    .then (ok) =>
      throw "no goTo onEnter" if !ok
      @session.setCurrentPage @ #Страничка утверждена, можно с уверенностью ее поставить
      @render()
    .then =>
      @bind()
      true

  #
  template: ->
    @session.template @

  #
  render: ->
    # @session.el.innerHTML=@template @
    Q(_.result @, "template")
    .then (html) => @session.$el.html html

  bind: ->
    res = _.result @, "onBind" # чтобы сначала rv, а потом уже wl
    @form=@session.getForm()
    @form.submit (event) => @formSubmit(event)
    @links=@session.getLinks()
    @links.click (event) => @linkClick(event)

  #
  formSubmit: (event) -> # двойная стрелка добавляет строку В НАЧАЛО конструктора, что создает лишний own property
    formData=@form.serializeObject()
    target=$(event.delegateTarget)
    @submit
      from: @
      to: target.attr("wl-submit") || "_next"
      data: @dataObj(formData, target.attr("wl-data-path"))
    event.preventDefault()

  dataObj: (submitData, path) ->
    data = {}
    data.last = submitData
    data[@name] = submitData
    data[path] = submitData if path
    data

  linkClick: (event) ->
    target=$(event.delegateTarget)
    @submit
      from: @
      to: target.attr("wl-submit")
      data: @dataObj(target.attr("wl-data"), target.attr("wl-data-path"))
    event.preventDefault()

  # ТОЛЬКО КЛИЕНТ
  submit: (options={from: @, to: "_next", data:{}})->
    next = null
    Q(options)
    .then (options)=>
      @onSubmit(options)
    .then (page) =>
      throw "no goTo onSubmit" if !page
      options.to = page
    .then (page) =>
      @session.getPage page # promise
    .then (page) =>
      next = page
      @setSubmitData options.data # асинхронно, поэтому пох
      _.result @, "onLeave"
    .then (ok) =>
      throw "no goTo onLeave" if !ok #здесь лучше проверка на false
      next.enter()
    .then (ok) =>
      throw "no enter" if !ok   # а лучше бы чтобы и при enterе был возможен редирект
      if options.to == "_back" # test me
        @session.backStack.pop()
      else
        @session.backStack.push(@) if next != @ && @backStack # откуда пришел
    .done() # проблема если после эксепшена должен выполняться еще другой код!!!

  setSubmitData: (data) -> # proxy override
    @session.setSubmitData(data)
    # TODO

  setLocal: (arr) ->
    _(arr).each (item) =>
      if _.isFunction(@[item])
        @proxyExtender.methods[item]=@[item].toString()
      else
        @proxyExtender.attributes[item]=@[item]

  setRemote: (arr) ->
    @proxyExtender.signatures = _(@proxyExtender.signatures.concat(arr)).compact()


  setSignatures: (signatures) ->
    _(signatures).each (name) =>
      @[name] = =>
        @app.invokeRemote name, _.toArray(arguments), @name # ОШИБКА

  #
  invoke: (cb, name, args) ->
    return false if !_(@allowRemote).contains name
    m = =>
      if _.isFunction(@[name]) then @[name].apply(@, args) else @[name] #типа _.result, но с аргументами
    Q(m())
    .then cb
