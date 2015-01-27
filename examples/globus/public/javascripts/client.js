(function() {
  $(function() {
    var offlineMode, time;
    time = function() {
      var d, utc;
      d = new Date();
      utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      return new Date(utc + (3600000 * 6));
    };
    offlineMode = function() {
      var el;
      el = document.getElementById("widlib");
      if ((typeof ltie !== "undefined" && ltie !== null) || !client.loaded) {
        return el.innerHTML = '<a href="http://gurman-ufa.ru" target="_blank"><img src="/images/offline.jpg"></a>';
      }
    };
    setTimeout(function() {
      return offlineMode();
    }, 1500);
    if (typeof ltie !== "undefined" && ltie !== null) {
      return offlineMode();
    } else {
      return window.client = new Widlib.Client({
        fallback: "/widlib",
        templates: JST,
        el: $('#widlib'),
        firstPage: function() {
          var h;
          h = time().getHours();
          if (h >= 10 && h < 21) {
            return "start";
          } else {
            return "sleep";
          }
        },
        pages: {
          start: {
            onBind: function() {
              return this.app.loaded = true;
            }
          },
          sleep: {
            "extends": "start"
          },
          main: {
            "extends": "common"
          },
          section: {
            "extends": "plusminus",
            local: ["setSection"],
            setSection: function() {
              this.sectionID = this.session.submits.main || this.session.submits.start;
              this.sectionName = this.session.data.sections[this.sectionID];
              return this.currentSection = _(this.session.data.products).where({
                section: this.sectionID
              });
            },
            onEnter: function() {
              this.extendsProducts();
              this.setSection();
              return true;
            }
          },
          cart: {
            "extends": "plusminus",
            local: ["cart"],
            onEnter: function() {
              this.sumtrigger = 0;
              this.extendsProducts();
              return this.cart()[0];
            }
          },
          form: {
            "extends": "common",
            local: ["submitForm"],
            remote: ["onSubmitServer"],
            submitForm: function() {
              return $("form[wl-submit]").submit();
            },
            onSubmit: function(options) {
              if (options.to !== "finish") {
                return options.to;
              }
              if (!options.data.form.address || !options.data.form.phone) {
                return false;
              }
              return Q(this.onSubmitServer(_(options.data.form).extend({
                products: this.cart()
              }))).then(function() {
                return options.to;
              });
            }
          },
          finish: {
            "extends": "common",
            local: ['clear'],
            onLeave: function() {
              this.clear();
              return true;
            },
            clear: function() {
              var _this = this;
              return _(this.session.data.products).each(function(product) {
                return product.quantity = 0;
              });
            }
          },
          details: {
            "extends": "common",
            backStack: false,
            onEnter: function() {
              console.log("");
              return this.product = _(this.session.data.products).findWhere({
                id: this.session.submits.detailsShow
              });
            }
          },
          info: {
            "extends": "common",
            backStack: false
          },
          common: {
            local: ['sum', 'sumStr', 'cart'],
            onBind: function() {
              rivets.bind(this.session.el, this);
              if (_(['section', 'cart', 'form', 'finish']).contains(this.name)) {
                return yaCounter23446726.reachGoal(this.name, {
                  order_price: this.sum(),
                  currency: "RUR",
                  exchange_rate: 1,
                  goods: this.cart()
                });
              }
            },
            sum: function(products) {
              if (products == null) {
                products = this.session.data.products;
              }
              return _(products).reduce(function(sum, product) {
                return sum + product.quantity * product.price;
              }, 0);
            },
            sumStr: function() {
              var ret;
              ret = this.sum();
              if (ret > 0) {
                return "" + ret + " руб";
              } else {
                return "";
              }
            },
            cart: function() {
              return _(this.session.data.products).filter(function(product) {
                return product.quantity;
              });
            }
          },
          plusminus: {
            "extends": "common",
            local: ['extendsProducts'],
            extendsProducts: function() {
              var _this = this;
              this.sumtrigger = 0;
              return _(this.session.data.products).each(function(product) {
                product.plus = function(event) {
                  product.quantity++;
                  event.preventDefault();
                  return _this.sumtrigger++;
                };
                product.minus = function(evetn) {
                  if (product.quantity) {
                    product.quantity--;
                  }
                  event.preventDefault();
                  return _this.sumtrigger++;
                };
                product.smallImage = function() {
                  return "/images/35/" + product.id + ".png";
                };
                product.bigImage = function() {
                  return "/images/200-90/" + product.id + ".png";
                };
                return product.quantity || (product.quantity = 0);
              });
            },
            onEnter: function() {
              this.extendsProducts();
              return true;
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
    }
  });

}).call(this);
