class Widlib.Server extends Widlib.Client

  constructor: (options) ->
    options.server = options.container = options.app = @
    options.show = false
    @sessions = []
    @options = options

  listen: (server, path) ->
    sock=shoe (stream) =>
      @serverD = @createServerDnode(stream)
      @serverD.pipe(stream).pipe @serverD
    sock.install server, path

  createServerDnode: (stream)->
    __this=@
    dnode (remote) ->
      session = new Widlib.Session _(__this.options).chain().clone().extend({stream: stream}).value()
      session.pipeClient = remote
      __this.sessions.push session
      @getProxyExtender = (cb, name) =>
        session.proxyRequested name, cb
      @pageInvoke = (cb, name, args, pageName) =>
        session.getPage(pageName).invoke(cb, name, args) # Почему только current page?!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Как контролировать доступ, если нет???
        #.getCurrentPage()
      @setSubmitData = (cb, data) =>
        session.setSubmitData data
        cb()
      @setCurrentPage = (cb, name) =>
        session.setCurrentPage name # Внимание! м.б. небезопасно!
        cb()

  # setClientData: (name, data, pipeClient) -> # убрать отсюда параметр клиент. Перенести метод в другое место. В сессию или миксин.
  #   deferred=Q.defer()
  #   pipeClient.setData ->
  #     deferred.resolve()
  #   , name, data
  #   deferred.promise
