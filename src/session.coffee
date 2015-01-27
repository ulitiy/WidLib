class Widlib.Session

#SERVER USE MIXIN!!!

  # у меня попросили выдать прокси
  proxyRequested: (name, cb)->
    p=null
    Q(@getPage name)
    .then (page)->
      p = page
      _.result page, "onProxyRequest"
    .then (ok) =>
      throw "no permission onProxyRequest" if !ok
      cb p.proxyExtender
    .done()

  sendData: (name) ->
    # @app.setClientData(name, @data[name], @pipeClient)
    deferred=Q.defer()
    @pipeClient.setData ->
      deferred.resolve()
    , name, @data[name]
    deferred.promise


#CLIENT
  defaults:
    pages: []
    show: true
    formSelector: "form[wl-submit]"
    linkSelector: "a[wl-submit]"
    data: {}
    submits: {}
    backStack: []

  # pages: [] #НИКОГДА!!!!! ОВЕРРАЙДЫ СЮДА САДЯТСЯ В ПРЕДКА!!!

  constructor: (options = {}) ->
    @rnd = Math.random()
    @options=_.chain(options).clone().defaults(@defaults).value()
    @setProperties @options
    @initPages @options.pages
    @show() if @options.show && @el

  setProperties: (options) ->
    _(@).extend _(options).omit('show','pages')
    @$el=$(@el) if $? && @el

  initPages: (hash) ->
    @pages = []
    @initPagesArr = _(hash).map (value, key) => _.chain(value).clone().defaults({name: key, session: @, app: @app}).value()
    while @initPagesArr[0]
      @initPage(0)

  initPage: (num) ->
    hash = @initPagesArr.splice(num,1)[0] # выдёргиваем элемент из массива
    page = new Widlib.Page hash #Внутри - рекурсия текущей функции.
    @pages.push(page)
    page

  #P/not return
  show: ->
    Q(@getCurrentPage())
    .then (page) ->
      page.enter()
    .done()

  #P
  getCurrentPage: ->
    return @currentPage if @currentPage
    Q(@_firstPage())
    .then (page) =>
      @setCurrentPage page

  _firstPage: ->
    return @getPage(page) if page = _.result(@,"firstPage") || @pages[0]
    @getProxy()

  #P
  getPageByName: (name) ->
    (_(@pages).find (p) -> p.name == name) || @getProxy(name)

  #P
  getNextPage: ->
    if @currentPage.constructor == Widlib.Page
      return @pages[_(@pages).indexOf(@currentPage)+1]
    else
      return @getNextProxy()

  getBackPage: ->
    while (back=@backStack.pop())==@currentPage
      ;
    @backStack.push(back)
    back

  #P
  getNextProxy: ->
    @getProxy true

  getProxy: (name) ->
    @app.getProxy name

  #P
  getPage: (page) ->
    if page == "_previous"
      @getPreviousPage()
    else if page == "_current" || !page
      @getCurrentPage()
    else if page == "_next" || page == true
      @getNextPage()
    else if page == "_back" || page == false
      @getBackPage()
    else if _.isString page
      @getPageByName(page)
    else
      page

  setCurrentPage: (page) ->
    @currentPage = @getPage(page)


  setSubmitData: (data) ->
    _(@submits).extend data

  template: (page) ->
    @templates["templates/#{page.name}"](page) || @templates['templates/main'](page) || page.body

  getForm: ->
    $(@formSelector)

  getLinks: ->
    $(@linkSelector)
