widlib=require("widlib-server")
server=widlib.init
  # Можно использовать любой шаблонизатор (index_template=Handlebars.compile("...")),
  # в функцию передается объект страницы, шаблон сохранится в @app.template
  template: index_template
  pages:
    type:
      # шаблоны можно также задавать индивидуально для каждой страницы
      template: type_template # @app.pages["type"].template
      body: "Выберите пиццу"
      # при клике на ссылку происходит событие submit, автоматический переход на следующую страницу (если не указано явно)
      # также у каждой страницы есть события onLeave, onEnter
      inputs: [
        { value: "Маргарита", type: "link", name: "type", price: 350 },
        { value: "Пепперони", type: "link", name: "type", price: 360 },
        { value: "Филадельфия", type: "link", name: "type", price: 370 },
        { value: "Четыре сыра", type: "link", name: "type", price: 380 },
      ]

    size:
      body: "Выберите размер"
      # если в параметре используем функцию - значение вычисляется лениво
      inputs: ->
        price = @session.input("type").price # session - хранит данные текущей сессии. @session.input("type") присвоился автоматически после страницы type.
        [
          { value: "30", type: "link", name: "size", price: price },
          { value: "40", type: "link", name: "size", price: price*1.2 },
          { value: "50", type: "link", name: "size", price: price*1.5 },
        ]
      # можно в явном виде указать следующую страницу или использовать функцию
      onSubmit: "address"

    address:
      body: "Введите адрес"
      inputs: [ { name: "address", type: "text", placeholder: "улица, дом, подъезд, квартира" }, { type: "submit", value: "Далее" } ]

    phone:
      body: "Введите телефон"
      inputs: [ { name: "phone", type: "text", placeholder: "+7 xxx xx xx" }, { type: "submit", value: "Далее" }]
      onSubmit: -> # также возможно использовать события onLoad, on
        @data("orders").push @session.values() # данные записываем в постоянное хранилище
        @data("email").push email_template(@session.values())
        "success" # возвращаем имя следующей страницы

    success:
      body: "Ваша пицца уже едет к вам"
      image: -> "/images/#{@session.value("type")}.jpg" # можно использовать дополнительные параметры, в данном случае image для view

  data:
    orders:
      type: "spreadsheet" # используя модули для различных API можно хранить или синхронизировать данные с внешними сервисами
      url: "https://docs.google.com/spreadsheet/ccc?key=0Au4e-jj1-69ZdEloMW03UExKLXI3cGRlbkJteGZFSUE#gid=0"
    email:
      type: "email"
      to: "1@interactiff.net"

server.listen "3000"


client=new Widlib.Client
  # здесь можно использовать тот же самый код, что и в серверной части.
  # pages: ...
  # data: ...
  server: "/"
  container: "#container"

