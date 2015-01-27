Widlib = {}
class Widlib.Client

  constructor: (options) ->
    options.client = options.container = options.app = @
    @options = options
    @session = new Widlib.Session @options


  connect: (fallback) ->
    return false if !fallback
    stream = shoe fallback
    promise=@createClientDnode()
    @clientD.pipe(stream).pipe @clientD
    promise

  createClientDnode: ->
    deferred=Q.defer()
    d = dnode
      setData: (cb, name, data) =>
        @session.data[name] = data # можно extend
        cb()
    @clientD = d
    d.on 'remote', (remote) =>
      @remote = remote
      deferred.resolve(remote)
    deferred.promise

  getProxy: (name) ->
    Q(@remote || @connect(@options.fallback))
    .then =>
      deferred=Q.defer()
      @remote.getProxyExtender (extender) =>
        proxy = new Widlib.PageProxy extender
        proxy.session = @session
        proxy.app = @
        @session.pages.push(proxy)
        deferred.resolve(proxy)
      , name
      deferred.promise

  setSubmitData: (data) ->
    Q(@remote || @connect(@options.fallback))
    .then =>
      deferred=Q.defer()
      @remote.setSubmitData ->
        deferred.resolve()
      , data
      deferred.promise

  setCurrentPage: (name) ->
    Q(@remote || @connect(@options.fallback))
    .then =>
      deferred=Q.defer()
      @remote.setCurrentPage ->
        deferred.resolve()
      , name
      deferred.promise

  invokeRemote: (name, args, pageName) -> # ОШИБКА
    Q(@remote || @connect(@options.fallback))
    .then =>
      deferred=Q.defer()
      @remote.pageInvoke (res) ->
        deferred.resolve(res)
      , name, args, pageName
      deferred.promise
