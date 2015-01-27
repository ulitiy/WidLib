$ ->
  time = ->
    d = new Date()
    utc = d.getTime() + (d.getTimezoneOffset() * 60000)
    new Date(utc + (3600000*6))
  offlineMode = ->
    el = document.getElementById("widlib")
    el.innerHTML = '<a href="http://gurman-ufa.ru" target="_blank"><img src="/images/offline.jpg"></a>' if ltie? || !client.loaded
  setTimeout ->
    offlineMode()
  , 1500
  if ltie?
    offlineMode()
  else
    window.client = new Widlib.Client
      fallback: "/widlib" # заменить на аякс
      templates: JST
      el: $('#widlib')




      firstPage: ->
        h=time().getHours()
        if h>=10 && h<21
          "start"
        else
          "sleep"
      pages:
        start:
          onBind: ->
            @app.loaded = true
        sleep:
          extends: "start"
        main:
          extends: "common"
        section:
          extends: "plusminus"
          local: ["setSection"]
          setSection: ->
            @sectionID=@session.submits.main || @session.submits.start
            @sectionName=@session.data.sections[@sectionID]
            @currentSection=_(@session.data.products).where # почему здесь, а не вынесено?!!!
              section: @sectionID
          onEnter: ->
            @extendsProducts()
            @setSection()
            true
        cart:
          extends: "plusminus"
          local: ["cart"]
          onEnter: ->
            @sumtrigger = 0
            @extendsProducts()
            @cart()[0]
        form:
          extends: "common"
          local: ["submitForm"]
          remote: ["onSubmitServer"]
          submitForm: ->
            $("form[wl-submit]").submit()
          onSubmit: (options)->
            return options.to if options.to != "finish"
            return false if !options.data.form.address || !options.data.form.phone
            Q(@onSubmitServer(_(options.data.form).extend({products: @cart()}))) # имя страницы автоматом, ок
            .then ->
              options.to
        finish:
          extends: "common"
          local: ['clear']
          onLeave: ->
            @clear()
            true
          clear: ->
            _(@session.data.products).each (product) =>
              product.quantity = 0
            # плюс здесь еще invoke этого же метода
        details:
          extends: "common"
          backStack: false
          onEnter: ->
            console.log ""
            @product=_(@session.data.products).findWhere id: @session.submits.detailsShow

        info:
          extends: "common"
          backStack: false

        common:
          local:  ['sum', 'sumStr', 'cart']
          onBind: ->
            rivets.bind(@session.el,@)
            if _(['section','cart','form','finish']).contains @name #ПЛОХО!
              yaCounter23446726.reachGoal @name,
                order_price: @sum()
                currency: "RUR"
                exchange_rate: 1
                goods: @cart()
          sum: (products=@session.data.products)->
            _(products).reduce (sum, product) ->
              sum + product.quantity*product.price
            , 0
          sumStr: ->
            ret = @sum()
            if ret > 0 then "#{ret} руб" else ""
          cart: ->
            _(@session.data.products).filter (product) ->
              product.quantity
        plusminus:
          extends: "common"
          local:  ['extendsProducts']
          extendsProducts: ->
            @sumtrigger = 0
            _(@session.data.products).each (product) =>
              product.plus = (event) =>
                # console.log ""
                product.quantity++
                event.preventDefault()
                @sumtrigger++ # этот сумтриггер - принадлежит только этой странице!!!
              product.minus = (evetn) =>
                product.quantity-- if product.quantity
                event.preventDefault()
                @sumtrigger++
              product.smallImage = -> "/images/35/#{product.id}.png"
              product.bigImage = -> "/images/200-90/#{product.id}.png"
              product.quantity ||= 0
          onEnter: ->
            @extendsProducts()
            true





      data:
        sections:
          pancakes: 'Блины'
          rolls: 'Роллы'
          salads: 'Салаты'
          hot: 'Горячее'
          desserts: 'Десерты'
          beverages: 'Напитки'
        products:
          [
              id: 'wo'
              section: 'pancakes'
              price: 35
              name: 'Блины без начинки'
            ,
              id: 'wquark'
              section: 'pancakes'
              price: 50
              name: 'Блины с творогом'
            ,
              id: 'wchicken'
              section: 'pancakes'
              price: 65
              name: 'Блины с курицей'
            ,
              id: 'wmeat'
              section: 'pancakes'
              price: 70
              name: 'Блины с мясом'
            ,
              id: 'california'
              section: 'rolls'
              price: 250
              name: 'Калифорния'
            ,
              id: 'canada'
              section: 'rolls'
              price: 270
              name: 'Канада'
            ,
              id: 'philadelphia'
              section: 'rolls'
              price: 250
              name: 'Филадельфия'
            ,
              id: 'kunsei'
              section: 'rolls'
              price: 200
              name: 'Кунсей'
            ,
              id: 'olivier'
              section: 'salads'
              price: 85
              name: 'Оливье'
            ,
              id: 'herring'
              section: 'salads'
              price: 70
              name: 'Сельдь под шубой'
            ,
              id: 'ceasar'
              section: 'salads'
              price: 140
              name: 'Цезарь с курицей'
            ,
              id: 'greek'
              section: 'salads'
              price: 120
              name: 'Греческий'
            ,
              id: 'pascarbonara'
              section: 'hot'
              price: 170
              name: 'Паста Карбонара'
            ,
              id: 'passalmon'
              section: 'hot'
              price: 195
              name: 'Паста с лососем'
            ,
              id: 'wokchicken'
              section: 'hot'
              price: 140
              name: 'Лапша китайская с курицей'
            ,
              id: 'wokveggie'
              section: 'hot'
              price: 110
              name: 'Лапша китайская с овощами'
            ,
              id: 'maminwhole'
              section: 'desserts'
              price: 550
              name: 'Торт "Мамин" целиком'
            ,
              id: 'maminpiece'
              section: 'desserts'
              price: 105
              name: 'Торт "Мамин" кусочек'
            ,
              id: 'honeywhole'
              section: 'desserts'
              price: 520
              name: 'Торт "Медовый" целиком'
            ,
              id: 'honeypiece'
              section: 'desserts'
              price: 80
              name: 'Торт "Медовый" кусочек'
            ,
              id: 'cowberry'
              section: 'beverages'
              price: 69
              name: 'Брусничный морс 0,5л'
            ,
              id: 'cranberry'
              section: 'beverages'
              price: 69
              name: 'Клюквенный морс 0,5л'
            ,
              id: 'cherry'
              section: 'beverages'
              price: 69
              name: 'Вишневый морс 0,5л'
            ,
              id: 'mojito'
              section: 'beverages'
              price: 69
              name: 'Мохито (б/а) 0,33л'
          ]
