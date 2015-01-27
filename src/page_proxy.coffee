class Widlib.PageProxy extends Widlib.Page

  constructor: (options) ->
    _(@).extend options.attributes
    @setMethods options.methods
    @setSignatures options.signatures

  setMethods: (methods) ->
    _(methods).each (value, key) =>
      eval "_this[key]=#{value}"

  # setSubmitData: (data) ->
  #   super(data)
  #   @app.setSubmitData data

  setCurrentPage: () ->
    super()
    @app.setCurrentPage @name
