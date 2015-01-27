Widlib.templateEngines=[]
widget=new Widlib.Widget template: "pizza" # default, фолдбэк к совсем стандартному
widget.setRemoteScript
  pages:
    default:
      template: "default" #default
      body: "default"
      inputs: -> @data "defaultInputs"
      inputs: [{name: "phone", type: "text", placeholder: "+7 xxx xx xx"},{type: "submit", value: "Далее"}]
      image: -> @imagePath @session("type")
      onSubmit: "selectSize" #default, next
      onSubmit: ->
        @pushData "orders", @session()
        "success"
      onLeave: ->
      onEnter: ->
      ways: ["p1","p2"]
      set: "type" #default

  data:
    types: [
      { value: "Маргарита", type: "link", name: "pizza_type", body: "Маргарита", price: 350, description: "" }
    ]
    sizes: [ 30, 40, 50 ]
    orders:
      type: "spreadsheet"
      url: "https://docs.google.com/spreadsheet/ccc?key=0Au4e-jj1-69ZdEloMW03UExKLXI3cGRlbkJteGZFSUE#gid=0"

Function.prototype.toString=null

#WidLib codeless framework for interactive apps

#session можно не хранить в БД, просто держать в памяти. Можно во временной БД.
#А как же долгое взаимодействие?
#session может хранить любые переменные или объекты
#remoteScript работает удаленно, если это возможно.
#localScript работает всегда локально.
#widlib template engines


# inputs ФОРМАТ???
# как сохраняются ответы? в виде inputs? В виде value! м.б. ассоциативный массив value: {}, тогда будет довольно просто его получить.
# session - как работает на клиенте, а как на сервере? Синхронизация при каждом запросе.
# Как работает сохранение сессии? см. выше.
# data - как на сервере/клиенте? на клиенте - только локальные данные.
# RPC неявные вставки. ок.
# Везде геттеры/сеттеры. Где везде? Data и Session
# Как работать с вложенными объектами mongodb?
# НИКАКОГО ДОСТУПА с клиентсайда и всё. Хочешь получить серверные данные - запрашивай серверную страницу.
# сессия - наоборот, полный доступ из всех мест. А точнее даже, отправляется при каждом действии (а если сейчас работаем локально???).
# local.onSubmit session.sync() зачем? хочешь синхронизироваться - делай онлайн.

# м.б. сделать 3 типа - local (всё локально), remote (темплейты локально, а код - на сервере), protected (все на сервере). Но чем поможет локальный темплейт,
# если данные не успевают. М.б. тогда проще отдельно явно обращаться к remote

# ДА! Важна возможность явного обращения к remote!!!


d=@data("type").create/get
d.set(1,2)
d.get(1)
+underscore

binding? page!!!
1 database per script/user?




Structure
  widget
    local
      pages
        inputs
      data
    remote
Structure inner
  widget (local/remote)
    pages of type Page
    data of type Adapter