widget=new Widlib.Widget template: "pizza"
widget.setRemoteScript
  pages:
    enter:
      body: "Enter your email"
      inputs: [{name: "email", type: "text", placeholder: "email@example.com"}, {type: "submit", value: "Далее"}]
      onSubmit: (input)->
        @addData("emails",input.email)
        @addData("notify",input.email)
        true
    thanks:
      body: "Thank you!"
  data:
    emails:
      type: "spreadsheet"
      url: "https://docs.google.com/spreadsheet/ccc?key=0Au4e-jj1-69ZdEloMW03UExKLXI3cGRlbkJteGZFSUE#gid=0"
    monkey:
      type: "surveymonkey"
      # ...
    notify:
      type: "email"
      text: -> "You have new subscriber: #{@session("pages").email}"
