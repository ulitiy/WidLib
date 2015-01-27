widget=new Widlib.Widget template: "pizza"
widget.setRemoteScript
  pages:
    question:
      body: ->
        @currentQuestion().body
      inputs: ->
        @currentQuestion().inputs
      currentQuestion: ->
        @cq||=@data("questions", @session("qNumber"))
      onSubmit: (input)->
        if input.answer!=@currentQuestion().correct
          return false #ignore failures
          # @mistake++ #количество попыток внутри задания
          # @widget.mistake++ #количество ошибок внутри викторины
          # if @mistake==2
          #   return "fail"
        @cq=null
        @session("qNumber", @session("qNumber")+1)
        return false if @currentQuestion()? # return this
        "win" #or true
    win:
      body: "You won!"
  data:
    questions:
      type: "spreadsheet"
      url: "https://docs.google.com/spreadsheet/ccc?key=0Au4e-jj1-69ZdEloMW03UExKLXI3cGRlbkJteGZFSUE#gid=0"
