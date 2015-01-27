var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["JST"] = this["JST"] || {};

this["JST"]["templates/cart"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\">\n\n    <div>\n\n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" /></a>\n        <a wl-submit=\"cart\" href=\"#\" class=\"basket\"><span>{ sumStr < sumtrigger }</span></a>\n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>Корзина</h1>\n\n        <!-- <div class=\"scroll-top\"><ins></ins></div> -->\n        <form action=\"\" class=\"basket-all\">\n      <ul class=\"choice\">\n          <li rv-each-product=\"cart\"><p><a href=\"#\">{ product.name }</a><span>{ product.price } руб</span></p><div class=\"number\"><a rv-on-click=\"product.minus\" href=\"#\">-</a><input rv-value=\"product.quantity\" type=\"text\" readonly /><a rv-on-click=\"product.plus\" href=\"#\">+</a></div></li>\n            <div class=\"clear\"></div>\n        </ul>\n        </form>\n        <!-- <div class=\"scroll-bottom\"><ins></ins></div> -->\n\n    </div>\n\n    <div class=\"footer\">\n          <a wl-submit=\"_back\" href=\"#\" class=\"link-left-small\"></a>\n            <a wl-submit=\"form\" href=\"#\" class=\"link-right-small\"><span>Заказать</span></a>\n       </div>\n</div>\n";
  });

this["JST"]["templates/details"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\">\n\n    <div>\n\n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" /></a>\n        <a wl-submit=\"cart\" href=\"#\" class=\"basket\"><span>{ sumStr < sumtrigger }</span></a>\n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>Роллы</h1>\n\n        <div class=\"popup\">\n          <a wl-submit=\"_back\" href=\"#\" class=\"close\"></a>\n          <img rv-src=\"product.bigImage\" />\n            <h2>{ product.name }</h2>\n            <p>{ product.price } руб.</p>\n        </div>\n\n\n    </div>\n\n    <div class=\"footer\">\n          <a wl-submit=\"_back\" href=\"#\" class=\"link-left-small\"></a>\n            <!-- <a href=\"link\" class=\"link-right-big\"><span>Заказать</span></a> -->\n       </div>\n\n</div>";
  });

this["JST"]["templates/finish"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\">\n\n    <div class=\"thanks\">\n\n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" /></a>\n        <a href=\"#\" class=\"basket\"></a>\n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>глобус гурман</h1>\n\n        <div class=\"center\">\n          <p><ins>Спасибо за заказ!</ins><br />Наш тел. (347) 293-68-16<br /><a href=\"link\">gurman-ufa.ru</a></a></p>\n            <p>Сумма заказа:<br /><ins>{ sumStr }</ins></p>\n            <p>Ждите звонка</p>\n        </div>\n\n\n    </div>\n\n    <div class=\"footer\">\n          <a wl-submit=\"main\" href=\"#\"  class=\"link-right-big\"><span>Еще</span></a>\n       </div>\n\n</div>";
  });

this["JST"]["templates/form"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\">\n\n    <div>\n\n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" /></a>\n        <a wl-submit=\"cart\" href=\"#\" class=\"basket\"><span>{ sumStr < sumtrigger }</span></a>\n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>Куда доставить?</h1>\n\n        <form wl-submit=\"finish\" class=\"delivery\">\n          <p>Адрес: *</p>\n            <input name=\"address\" rv-value=\"address\" type=\"text\" />\n            <p>Телефон: *</p>\n            <input name=\"phone\" rv-value=\"phone\" type=\"text\" />\n            <p>Комментарий:</p>\n            <input name=\"comment\" rv-value=\"comment\" type=\"text\" />\n            <input type=\"submit\" style=\"position: absolute; width: 0; height: 0;\"/>\n        </form>\n\n\n    </div>\n\n    <div class=\"footer\">\n          <a wl-submit=\"_back\" href=\"#\" class=\"link-left-small\"></a>\n            <a rv-on-click=\"submitForm\" href=\"#\" class=\"link-right-big\"><span>Заказать</span></a>\n       </div>\n\n</div>";
  });

this["JST"]["templates/info"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\">\n  \n    <div>\n      \n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" /></a>\n        <a wl-submit=\"cart\" href=\"#\" class=\"basket\"><span>{ sumStr < sumtrigger }</span></a>\n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>Информация</h1>\n        \n        <div class=\"center\">\n          <p>Время работы:<br />с 8:00 до 23:00</p>\n            <p>Сроки доставки:<br />в течение часа, в отедельные районы в течение 3 часов</p>\n            <p>Доставка: 150 рублей.</p>\n            <p>Бесплатная доставка:<br />от 1000 руб.</p>\n            <p>Тел. (347) 293-68-16</p>\n        </div>\n        \n        \n    </div>\n    \n    <div class=\"footer\">\n          <a wl-submit=\"_back\" href=\"#\" class=\"link-left-small\"></a>\n       </div>\n  \n</div>";
  });

this["JST"]["templates/main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\">\n\n    <div>\n\n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" /></a>\n        <a wl-submit=\"cart\" href=\"#\" class=\"basket\"><span>{ sumStr }</span></a>\n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>глобус гурман</h1>\n\n      <ul class=\"choice double\">\n          <li><a wl-submit=\"section\" wl-data=\"pancakes\" href=\"#\"><img src=\"/images/35/wo.png\" alt=\"\" /><span>Блины</a></span></li>\n            <li class=\"right\"><a wl-submit=\"section\" wl-data=\"rolls\" href=\"#\"><img src=\"/images/35/philadelphia.png\" alt=\"\" /><span>Роллы</a></span></li>\n            <li><a wl-submit=\"section\" wl-data=\"salads\" href=\"#\"><img src=\"/images/35/greek.png\" alt=\"\" /><span>Салаты</a></span></li>\n            <li class=\"right\"><a wl-submit=\"section\" wl-data=\"hot\" href=\"#\"><img src=\"/images/35/wokveggie.png\" alt=\"\" /><span>Горячее</a></span></li>\n            <li><a wl-submit=\"section\" wl-data=\"desserts\" href=\"#\"><img src=\"/images/35/honeywhole.png\" alt=\"\" /><span>Десерты</a></span></li>\n            <li class=\"right\"><a wl-submit=\"section\" wl-data=\"beverages\" href=\"#\"><img src=\"/images/35/mojito.png\" alt=\"\" /><span>Напитки</a></span></li>\n            <div class=\"clear\"></div>\n        </ul>\n\n    </div>\n\n    <div class=\"footer\">\n            <a wl-submit=\"cart\" href=\"#\" class=\"link-right-small\">Заказать</a>\n       </div>\n\n</div>\n";
  });

this["JST"]["templates/section"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\">\n\n    <div>\n\n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" /></a>\n        <a wl-submit=\"cart\" href=\"#\" class=\"basket\"><span>{ sumStr < sumtrigger }</span></a>\n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>{ sectionName }</h1>\n\n        <form action=\"\">\n      <ul class=\"choice\">\n          <li rv-each-product=\"currentSection\" ><a wl-submit=\"details\" href=\"#\"><img rv-src=\"product.smallImage\" alt=\"\" /></a><p><a  wl-submit=\"details\" rv-wl-data=\"product.id\" wl-data-path=\"detailsShow\" href=\"#\">{ product.name }</a><span>{ product.price } руб</span></p><div class=\"number\"><a rv-on-click=\"product.minus\" href=\"#\">-</a><input type=\"text\" rv-value=\"product.quantity\" readonly /><a rv-on-click=\"product.plus\" href=\"#\">+</a></div></li>\n            <div class=\"clear\"></div>\n        </ul>\n        </form>\n\n    </div>\n\n    <div class=\"footer\">\n          <a wl-submit=\"main\" href=\"#\" class=\"link-left-small\"></a>\n            <a wl-submit=\"cart\" href=\"#\" class=\"link-right-big\"><span>Заказать</span></a>\n       </div>\n\n</div>\n";
  });

this["JST"]["templates/sleep"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\" class=\"night\">\n  \n    <div>\n      \n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" /></a>\n         \n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>глобус гурман</h1>\n        <p class=\"slogan\">Глобус спит...<br />заказывайте нашу продукцию завтра</p>\n      \n    </div>\n    \n \n  \n</div>";
  });

this["JST"]["templates/start"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"container\">\n    <div>\n\n        <a href=\"http://gurman-ufa.ru\" target=\"_blank\" ><img src=\"/images/logo.png\" class=\"logo\" alt=\"глобус гурман\" loop=infinite /></a>\n        <a wl-submit=\"cart\" href=\"#\" class=\"basket\"></a>\n        <a wl-submit=\"info\" href=\"#\" class=\"info\"></a>\n        <h1>глобус гурман</h1>\n\n      <ul class=\"choice double\">\n          <li><a wl-submit=\"section\" wl-data=\"pancakes\" href=\"#\"><img src=\"/images/35/wo.png\" alt=\"\" /><span>Блины</a></span></li>\n            <li class=\"right\"><a wl-submit=\"section\" wl-data=\"rolls\" href=\"#\"><img src=\"/images/35/philadelphia.png\" alt=\"\" /><span>Роллы</a></span></li>\n            <li><a wl-submit=\"section\" wl-data=\"salads\" href=\"#\"><img src=\"/images/35/greek.png\" alt=\"\" /><span>Салаты</a></span></li>\n            <li class=\"right\"><a wl-submit=\"section\" wl-data=\"hot\" href=\"#\"><img src=\"/images/35/wokveggie.png\" alt=\"\" /><span>Горячее</a></span></li>\n            <li><a wl-submit=\"section\" wl-data=\"desserts\" href=\"#\"><img src=\"/images/35/honeywhole.png\" alt=\"\" /><span>Десерты</a></span></li>\n            <li class=\"right\"><a wl-submit=\"section\" wl-data=\"beverages\" href=\"#\"><img src=\"/images/35/mojito.png\" alt=\"\" /><span>Напитки</a></span></li>\n            <div class=\"clear\"></div>\n        </ul>\n\n    </div>\n\n    <div class=\"footer\">\n          <p class=\"slogan\">Закажи прямо здесь!</p>\n       </div>\n\n</div>\n";
  });

if (typeof exports === 'object' && exports) {module.exports = this["JST"];}