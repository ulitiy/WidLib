_.mixin
  extendOwn: (obj)->
    _.each Array.prototype.slice.call(arguments, 1), (source) ->
      if source
        for own key, value of source
          obj[key] = value
    return obj
