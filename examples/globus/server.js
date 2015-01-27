(function() {
  var JST, Widlib, ecstatic, http, nodemailer, server, smtpTransport, time, util, wls, _;

  http = require('http');

  Widlib = require('./widlib');

  JST = require('./templates');

  _ = require('underscore');

  util = require('util');

  nodemailer = require('nodemailer');

  smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: "robot@interactiff.net",
      pass: "Bv44g3y1"
    }
  });

  ecstatic = require('ecstatic')(__dirname + '/public/');

  server = http.createServer(ecstatic);

  server.listen(9999);

  time = function() {
    var d, utc;
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 6));
  };

  wls = new Widlib.Server({
    pages: {
      form: {
        allowRemote: ["onSubmitServer"],
        onSubmitServer: function(options) {
          var mailOptions;
          mailOptions = {
            from: "robot@interactiff.net",
            to: "ulitiy@gmail.com, denzlobin@gmail.com, estkdostavka@gmail.com",
            subject: "Заказ доставки от " + (time()),
            text: "Адрес: " + options.address + "\nТелефон: " + options.phone + "\nКомментарий: " + options.comment + "\nСумма: " + (this.sum(options.products)) + " руб.\n"
          };
          _(options.products).each(function(product) {
            return mailOptions.text += "" + product.name + " --  " + product.price + "руб/шт  |  " + product.quantity + " шт.  |  Сумма:" + (product.price * product.quantity) + " руб\n";
          });
          return smtpTransport.sendMail(mailOptions, function() {});
        },
        sum: function(products) {
          if (products == null) {
            products = this.session.data.products;
          }
          return _(products).reduce(function(sum, product) {
            return sum + product.quantity * product.price;
          }, 0);
        },
        cart: function() {
          return _(this.session.data.products).filter(function(product) {
            return product.quantity;
          });
        }
      }
    },
    data: {
      sections: {
        pancakes: 'Блины',
        rolls: 'Роллы',
        salads: 'Салаты',
        hot: 'Горячее',
        desserts: 'Десерты',
        beverages: 'Напитки'
      },
      products: [
        {
          id: 'wo',
          section: 'pancakes',
          price: 35,
          name: 'Блины без начинки'
        }, {
          id: 'wquark',
          section: 'pancakes',
          price: 50,
          name: 'Блины с творогом'
        }, {
          id: 'wchicken',
          section: 'pancakes',
          price: 65,
          name: 'Блины с курицей'
        }, {
          id: 'wmeat',
          section: 'pancakes',
          price: 70,
          name: 'Блины с мясом'
        }, {
          id: 'california',
          section: 'rolls',
          price: 250,
          name: 'Калифорния'
        }, {
          id: 'canada',
          section: 'rolls',
          price: 270,
          name: 'Канада'
        }, {
          id: 'philadelphia',
          section: 'rolls',
          price: 250,
          name: 'Филадельфия'
        }, {
          id: 'kunsei',
          section: 'rolls',
          price: 200,
          name: 'Кунсей'
        }, {
          id: 'olivier',
          section: 'salads',
          price: 85,
          name: 'Оливье'
        }, {
          id: 'herring',
          section: 'salads',
          price: 70,
          name: 'Сельдь под шубой'
        }, {
          id: 'ceasar',
          section: 'salads',
          price: 140,
          name: 'Цезарь с курицей'
        }, {
          id: 'greek',
          section: 'salads',
          price: 120,
          name: 'Греческий'
        }, {
          id: 'pascarbonara',
          section: 'hot',
          price: 170,
          name: 'Паста Карбонара'
        }, {
          id: 'passalmon',
          section: 'hot',
          price: 195,
          name: 'Паста с лососем'
        }, {
          id: 'wokchicken',
          section: 'hot',
          price: 140,
          name: 'Лапша китайская с курицей'
        }, {
          id: 'wokveggie',
          section: 'hot',
          price: 110,
          name: 'Лапша китайская с овощами'
        }, {
          id: 'maminwhole',
          section: 'desserts',
          price: 550,
          name: 'Торт "Мамин" целиком'
        }, {
          id: 'maminpiece',
          section: 'desserts',
          price: 105,
          name: 'Торт "Мамин" кусочек'
        }, {
          id: 'honeywhole',
          section: 'desserts',
          price: 520,
          name: 'Торт "Медовый" целиком'
        }, {
          id: 'honeypiece',
          section: 'desserts',
          price: 80,
          name: 'Торт "Медовый" кусочек'
        }, {
          id: 'cowberry',
          section: 'beverages',
          price: 69,
          name: 'Брусничный морс 0,5л'
        }, {
          id: 'cranberry',
          section: 'beverages',
          price: 69,
          name: 'Клюквенный морс 0,5л'
        }, {
          id: 'cherry',
          section: 'beverages',
          price: 69,
          name: 'Вишневый морс 0,5л'
        }, {
          id: 'mojito',
          section: 'beverages',
          price: 69,
          name: 'Мохито (б/а) 0,33л'
        }
      ]
    }
  });

  wls.listen(server, '/widlib');

}).call(this);
