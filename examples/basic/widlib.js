// widlib
// version: 0.0.1
// author: Alexander Ulitin <1@interactiff.net>
// license: MIT
// widlib
// version: 0.0.1
// author: Alexander Ulitin <1@interactiff.net>
// license: MIT
(function() {
  var Q, Widlib, dnode, root, shoe, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Widlib = {};

  shoe = require('shoe');

  dnode = require('dnode');

  Widlib.Client = (function() {
    function Client(options) {
      var _this = this;
      options.client = options.container = this;
      this.options = options;
      Q(this.connect(options.fallback)).then(function() {
        return _this.session = new Widlib.Session(_this.options);
      });
    }

    Client.prototype.connect = function(fallback) {
      var promise, stream;
      if (!fallback) {
        return false;
      }
      stream = shoe(fallback);
      promise = this.createClientDnode();
      this.clientD.pipe(stream).pipe(this.clientD);
      return promise;
    };

    Client.prototype.createClientDnode = function() {
      var d, deferred,
        _this = this;
      deferred = Q.defer();
      d = dnode();
      this.clientD = d;
      d.on('remote', function(remote) {
        _this.remote = remote;
        return deferred.resolve(remote);
      });
      return deferred.promise;
    };

    Client.prototype.getProxy = function(name) {
      var deferred,
        _this = this;
      deferred = Q.defer();
      this.remote.getProxyExtender(name, function(extender) {
        var proxy;
        proxy = new Widlib.PageProxy(extender);
        proxy.app = _this.session;
        _this.session.pages[proxy.name] = proxy;
        return deferred.resolve(proxy);
      });
      return deferred.promise;
    };

    Client.prototype.invokeRemote = function(name, args) {
      var deferred;
      deferred = Q.defer();
      this.remote.pageInvoke(name, function(res) {
        return deferred.resolve(res);
      });
      return deferred.promise;
    };

    return Client;

  })();

  Widlib.Page = (function() {
    function Page(options) {
      this.submit = __bind(this.submit, this);
      this.bind = __bind(this.bind, this);
      this.render = __bind(this.render, this);
      this.proxyExtender = {
        methods: {},
        signatures: [],
        attributes: {
          name: options.name
        }
      };
      _(this).extend(options);
      this.setDefaultProxy();
    }

    Page.prototype.setDefaultProxy = function() {
      this.setRemote(["onEnter", "onSubmit", "onLeave"]);
      return this.setLocal(["onBind"]);
    };

    Page.prototype.onEnter = true;

    Page.prototype.onBind = true;

    Page.prototype.onSubmit = true;

    Page.prototype.onLeave = true;

    Page.prototype.onProxyRequest = true;

    Page.prototype.show = function() {
      var _this = this;
      return Q(_.result(this, "onEnter")).then(function(ok) {
        if (!ok) {
          throw "no goTo onEnter";
        }
        return _this.render();
      }).then(function() {
        _this.bind();
        return _.result(_this, "onBind");
      });
    };

    Page.prototype.template = function(param) {
      return this.app.template(param);
    };

    Page.prototype.render = function() {
      return this.app.$el.html(this.template(this));
    };

    Page.prototype.bind = function() {
      this.form = this.app.getForm();
      return this.form.submit(this.submit);
    };

    Page.prototype.submit = function() {
      var json, next,
        _this = this;
      json = this.form.serializeObject();
      next = null;
      Q(_.result(this, "onSubmit")).then(function(page) {
        next = _this.app.getPage(page);
        if (!next) {
          throw "no goTo onSubmit";
        }
        _this.setResult(json);
        return _.result(_this, "onLeave");
      }).then(function(ok) {
        if (!ok) {
          throw "no goTo onLeave";
        }
        return _this.app.goTo(next);
      });
      return false;
    };

    Page.prototype.setResult = function(json) {};

    Page.prototype.setLocal = function(arr) {
      var _this = this;
      return _(arr).each(function(item) {
        switch (_this[item].constructor) {
          case Function:
            return _this.proxyExtender.methods[item] = _this[item].toString();
          default:
            return _this.proxyExtender.attributes[item] = _this[item];
        }
      });
    };

    Page.prototype.setRemote = function(arr) {
      return this.proxyExtender.signatures = this.proxyExtender.signatures.concat(arr);
    };

    Page.prototype.invokeWhitelist = [];

    Page.prototype.invoke = function(name, args, cb) {
      if (!_(this.invokeWhitelist).contains(name)) {
        return;
      }
      return Q(this[name].apply(this, args)).then(cb);
    };

    return Page;

  })();

  Widlib.PageProxy = (function(_super) {
    __extends(PageProxy, _super);

    function PageProxy(options) {
      _(this).extend(options.attributes);
      this.setMethods(options.methods);
      this.setSignatures(options.signatures);
    }

    PageProxy.prototype.setMethods = function(methods) {
      return _(methods).each(function(value, key) {
        return this[key] = function() {
          return eval(value);
        };
      });
    };

    PageProxy.prototype.setSignatures = function(signatures) {
      return _(signatures).each(function(name) {
        return this[name] = function() {
          return this.app.container.invokeRemote(name, arguments);
        };
      });
    };

    return PageProxy;

  })(Widlib.Page);

  if (typeof $ !== "undefined" && $ !== null) {
    $.fn.serializeObject = function() {
      var json, patterns, push_counters,
        _this = this;
      json = {};
      push_counters = {};
      patterns = {
        validate: /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
        key: /[a-zA-Z0-9_]+|(?=\[\])/g,
        push: /^$/,
        fixed: /^\d+$/,
        named: /^[a-zA-Z0-9_]+$/
      };
      this.build = function(base, key, value) {
        base[key] = value;
        return base;
      };
      this.push_counter = function(key) {
        if (push_counters[key] === void 0) {
          push_counters[key] = 0;
        }
        return push_counters[key]++;
      };
      $.each($(this).serializeArray(), function(i, elem) {
        var k, keys, merge, re, reverse_key;
        if (!patterns.validate.test(elem.name)) {
          return;
        }
        keys = elem.name.match(patterns.key);
        merge = elem.value;
        reverse_key = elem.name;
        while ((k = keys.pop()) !== void 0) {
          if (patterns.push.test(k)) {
            re = new RegExp("\\[" + k + "\\]$");
            reverse_key = reverse_key.replace(re, '');
            merge = _this.build([], _this.push_counter(reverse_key), merge);
          } else if (patterns.fixed.test(k)) {
            merge = _this.build([], k, merge);
          } else if (patterns.named.test(k)) {
            merge = _this.build({}, k, merge);
          }
        }
        return json = $.extend(true, json, merge);
      });
      return json;
    };
  }

  shoe = require('shoe');

  dnode = require('dnode');

  _ = require('underscore');

  Widlib.Server = (function(_super) {
    __extends(Server, _super);

    function Server(options) {
      options.server = options.container = this;
      options.show = false;
      this.options = options;
    }

    Server.prototype.listen = function(server, path) {
      var sock,
        _this = this;
      sock = shoe(function(stream) {
        _this.serverD = _this.createServerDnode();
        return _this.serverD.pipe(stream).pipe(_this.serverD);
      });
      return sock.install(server, path);
    };

    Server.prototype.createServerDnode = function() {
      var __this;
      __this = this;
      return dnode(function(client) {
        var session,
          _this = this;
        session = new Widlib.Session(__this.options);
        this.getProxyExtender = function(name, cb) {
          return session.proxyRequested(name, cb);
        };
        return this.pageInvoke = function(name, args, cb) {
          return session.currentPage().invoke(name, args, cb);
        };
      });
    };

    return Server;

  })(Widlib.Client);

  Q = require('q');

  Widlib.Session = (function() {
    Session.prototype.proxyRequested = function(name, cb) {
      var p,
        _this = this;
      p = null;
      return Q(this.getPage(name)).then(function(page) {
        p = page;
        return _.result(page, "onProxyRequest");
      }).then(function(ok) {
        if (!ok) {
          throw "no permission onProxyRequest";
        }
        _this.currentPage = p;
        return cb(p.proxyExtender);
      });
    };

    Session.prototype.defaults = {
      pages: [],
      show: true,
      formSelector: "form[wl-form]"
    };

    function Session(options) {
      if (options == null) {
        options = {};
      }
      _(options).defaults(this.defaults);
      this.setProperties(options);
      this.initPages(options.pages);
      if (options.show && this.el) {
        this.show();
      }
    }

    Session.prototype.setProperties = function(options) {
      _(this).extend(_(options).omit('show', 'pages'));
      if ((typeof $ !== "undefined" && $ !== null) && this.el) {
        return this.$el = $(this.el);
      }
    };

    Session.prototype.initPages = function(hash) {
      var _this = this;
      return this.pages = _(hash).map(function(value, key) {
        var page;
        return page = new Widlib.Page(_(value).defaults({
          name: key,
          app: _this
        }));
      });
    };

    Session.prototype.show = function() {
      return Q(this.getCurrentPage()).then(function(page) {
        return page.show();
      });
    };

    Session.prototype.getCurrentPage = function() {
      return this.currentPage || (this.currentPage = this.pages[0] || this.getProxy());
    };

    Session.prototype.getNextPage = function() {
      if (this.currentPage.constructor === Widlib.Page) {
        return this.pages[_(this.pages).indexOf(this.currentPage) + 1];
      } else {
        return this.getNextProxy();
      }
    };

    Session.prototype.getNextProxy = function() {
      return this.getProxy(true);
    };

    Session.prototype.getProxy = function(name) {
      return this.container.getProxy(name);
    };

    Session.prototype.goTo = function(page) {
      this.currentPage = this.getPage(page);
      return this.show();
    };

    Session.prototype.getPage = function(page) {
      if (!page) {
        return this.getCurrentPage();
      } else if (_.isString(page)) {
        return _(this.pages).find(function(p) {
          return p.name === page;
        });
      } else {
        return this.getNextPage();
      }
    };

    Session.prototype.template = function(page) {
      return page.body;
    };

    Session.prototype.getForm = function() {
      return $(this.formSelector);
    };

    return Session;

  })();

  root = this;

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Widlib;
    }
  } else {
    root.Widlib = Widlib;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.Widlib = Widlib;
  }

}).call(this);
