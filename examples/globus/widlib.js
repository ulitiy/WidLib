// widlib
// version: 0.0.1
// author: Alexander Ulitin <1@interactiff.net>
// license: MIT
(function() {
  var Q, Widlib, dnode, root, shoe, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  shoe = require('shoe');

  dnode = require('dnode');

  _ = require('underscore');

  Q = require('q');

  Widlib = {};

  Widlib.Client = (function() {
    function Client(options) {
      options.client = options.container = options.app = this;
      this.options = options;
      this.session = new Widlib.Session(this.options);
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
      d = dnode({
        setData: function(cb, name, data) {
          _this.session.data[name] = data;
          return cb();
        }
      });
      this.clientD = d;
      d.on('remote', function(remote) {
        _this.remote = remote;
        return deferred.resolve(remote);
      });
      return deferred.promise;
    };

    Client.prototype.getProxy = function(name) {
      var _this = this;
      return Q(this.remote || this.connect(this.options.fallback)).then(function() {
        var deferred;
        deferred = Q.defer();
        _this.remote.getProxyExtender(function(extender) {
          var proxy;
          proxy = new Widlib.PageProxy(extender);
          proxy.session = _this.session;
          proxy.app = _this;
          _this.session.pages.push(proxy);
          return deferred.resolve(proxy);
        }, name);
        return deferred.promise;
      });
    };

    Client.prototype.setSubmitData = function(data) {
      var _this = this;
      return Q(this.remote || this.connect(this.options.fallback)).then(function() {
        var deferred;
        deferred = Q.defer();
        _this.remote.setSubmitData(function() {
          return deferred.resolve();
        }, data);
        return deferred.promise;
      });
    };

    Client.prototype.setCurrentPage = function(name) {
      var _this = this;
      return Q(this.remote || this.connect(this.options.fallback)).then(function() {
        var deferred;
        deferred = Q.defer();
        _this.remote.setCurrentPage(function() {
          return deferred.resolve();
        }, name);
        return deferred.promise;
      });
    };

    Client.prototype.invokeRemote = function(name, args, pageName) {
      var _this = this;
      return Q(this.remote || this.connect(this.options.fallback)).then(function() {
        var deferred;
        deferred = Q.defer();
        _this.remote.pageInvoke(function(res) {
          return deferred.resolve(res);
        }, name, args, pageName);
        return deferred.promise;
      });
    };

    return Client;

  })();

  _.mixin({
    extendOwn: function(obj) {
      _.each(Array.prototype.slice.call(arguments, 1), function(source) {
        var key, value, _results;
        if (source) {
          _results = [];
          for (key in source) {
            if (!__hasProp.call(source, key)) continue;
            value = source[key];
            _results.push(obj[key] = value);
          }
          return _results;
        }
      });
      return obj;
    }
  });

  Widlib.Page = (function() {
    function Page(options) {
      this.session = options.session;
      this["extends"] = options["extends"];
      this.setInnerValues();
      this.applyExtends();
      this.rnd = Math.random();
      this.proxyExtender = {
        methods: {},
        signatures: [],
        attributes: {
          name: options.name
        }
      };
      _(this).extend(options);
      this.localInner = _.chain(this.localInner.concat(this.local)).difference(this.remote).uniq().value();
      this.remoteInner = _.chain(this.remoteInner.concat(this.remote)).difference(this.local).uniq().value();
      this.setProxyExtender();
      this.setSignatures(this.remoteInner);
    }

    Page.prototype.applyExtends = function() {
      var _this = this;
      this["extends"] = _([this["extends"]]).chain().flatten().compact().value();
      return _(this["extends"]).each(function(name) {
        return _this.applyExtend(name, _this.session.initPagesArr);
      });
    };

    Page.prototype.applyExtend = function(name) {
      var arr, obj, page,
        _this = this;
      arr = this.session.initPagesArr;
      page = _(this.session.pages).find(function(page) {
        return page.name === name;
      });
      if (!page) {
        obj = _(arr).find(function(obj) {
          return obj.name === name;
        });
        page = this.session.initPage(_(arr).indexOf(obj));
      }
      _(this).extendOwn(_(page).omit('localInner', 'remoteInner'));
      this.localInner = _.chain(this.localInner.concat(page.localInner)).difference(page.remoteInner).uniq().value();
      return this.remoteInner = _.chain(this.remoteInner.concat(page.remoteInner)).difference(page.localInner).uniq().value();
    };

    Page.prototype.setInnerValues = function() {
      this.localInner = ["onBind", "name", "onEnter", "onSubmit", "onLeave", "backStack", "template"];
      this.remoteInner = [];
      this.local = [];
      return this.remote = [];
    };

    Page.prototype.setProxyExtender = function() {
      this.localInner = _.chain(this.localInner.concat(this.local)).difference(this.remote).uniq().value();
      this.remoteInner = _.chain(this.remoteInner.concat(this.remote)).difference(this.local).uniq().value();
      this.setLocal(this.localInner);
      return this.setRemote(this.remoteInner);
    };

    Page.prototype.onEnter = true;

    Page.prototype.onBind = true;

    Page.prototype.onSubmit = function(options) {
      return options.to;
    };

    Page.prototype.onLeave = true;

    Page.prototype.onProxyRequest = true;

    Page.prototype.backStack = true;

    Page.prototype.enter = function() {
      var _this = this;
      return Q(_.result(this, "onEnter")).then(function(ok) {
        if (!ok) {
          throw "no goTo onEnter";
        }
        _this.session.setCurrentPage(_this);
        return _this.render();
      }).then(function() {
        _this.bind();
        return true;
      });
    };

    Page.prototype.template = function() {
      return this.session.template(this);
    };

    Page.prototype.render = function() {
      var _this = this;
      return Q(_.result(this, "template")).then(function(html) {
        return _this.session.$el.html(html);
      });
    };

    Page.prototype.bind = function() {
      var res,
        _this = this;
      res = _.result(this, "onBind");
      this.form = this.session.getForm();
      this.form.submit(function(event) {
        return _this.formSubmit(event);
      });
      this.links = this.session.getLinks();
      return this.links.click(function(event) {
        return _this.linkClick(event);
      });
    };

    Page.prototype.formSubmit = function(event) {
      var formData, target;
      formData = this.form.serializeObject();
      target = $(event.delegateTarget);
      this.submit({
        from: this,
        to: target.attr("wl-submit") || "_next",
        data: this.dataObj(formData, target.attr("wl-data-path"))
      });
      return event.preventDefault();
    };

    Page.prototype.dataObj = function(submitData, path) {
      var data;
      data = {};
      data.last = submitData;
      data[this.name] = submitData;
      if (path) {
        data[path] = submitData;
      }
      return data;
    };

    Page.prototype.linkClick = function(event) {
      var target;
      target = $(event.delegateTarget);
      this.submit({
        from: this,
        to: target.attr("wl-submit"),
        data: this.dataObj(target.attr("wl-data"), target.attr("wl-data-path"))
      });
      return event.preventDefault();
    };

    Page.prototype.submit = function(options) {
      var next,
        _this = this;
      if (options == null) {
        options = {
          from: this,
          to: "_next",
          data: {}
        };
      }
      next = null;
      return Q(options).then(function(options) {
        return _this.onSubmit(options);
      }).then(function(page) {
        if (!page) {
          throw "no goTo onSubmit";
        }
        return options.to = page;
      }).then(function(page) {
        return _this.session.getPage(page);
      }).then(function(page) {
        next = page;
        _this.setSubmitData(options.data);
        return _.result(_this, "onLeave");
      }).then(function(ok) {
        if (!ok) {
          throw "no goTo onLeave";
        }
        return next.enter();
      }).then(function(ok) {
        if (!ok) {
          throw "no enter";
        }
        if (options.to === "_back") {
          return _this.session.backStack.pop();
        } else {
          if (next !== _this && _this.backStack) {
            return _this.session.backStack.push(_this);
          }
        }
      }).done();
    };

    Page.prototype.setSubmitData = function(data) {
      return this.session.setSubmitData(data);
    };

    Page.prototype.setLocal = function(arr) {
      var _this = this;
      return _(arr).each(function(item) {
        if (_.isFunction(_this[item])) {
          return _this.proxyExtender.methods[item] = _this[item].toString();
        } else {
          return _this.proxyExtender.attributes[item] = _this[item];
        }
      });
    };

    Page.prototype.setRemote = function(arr) {
      return this.proxyExtender.signatures = _(this.proxyExtender.signatures.concat(arr)).compact();
    };

    Page.prototype.setSignatures = function(signatures) {
      var _this = this;
      return _(signatures).each(function(name) {
        return _this[name] = function() {
          return _this.app.invokeRemote(name, _.toArray(arguments), _this.name);
        };
      });
    };

    Page.prototype.invoke = function(cb, name, args) {
      var m,
        _this = this;
      if (!_(this.allowRemote).contains(name)) {
        return false;
      }
      m = function() {
        if (_.isFunction(_this[name])) {
          return _this[name].apply(_this, args);
        } else {
          return _this[name];
        }
      };
      return Q(m()).then(cb);
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
      var _this = this;
      return _(methods).each(function(value, key) {
        return eval("_this[key]=" + value);
      });
    };

    PageProxy.prototype.setCurrentPage = function() {
      PageProxy.__super__.setCurrentPage.call(this);
      return this.app.setCurrentPage(this.name);
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

  Widlib.Server = (function(_super) {
    __extends(Server, _super);

    function Server(options) {
      options.server = options.container = options.app = this;
      options.show = false;
      this.sessions = [];
      this.options = options;
    }

    Server.prototype.listen = function(server, path) {
      var sock,
        _this = this;
      sock = shoe(function(stream) {
        _this.serverD = _this.createServerDnode(stream);
        return _this.serverD.pipe(stream).pipe(_this.serverD);
      });
      return sock.install(server, path);
    };

    Server.prototype.createServerDnode = function(stream) {
      var __this;
      __this = this;
      return dnode(function(remote) {
        var session,
          _this = this;
        session = new Widlib.Session(_(__this.options).chain().clone().extend({
          stream: stream
        }).value());
        session.pipeClient = remote;
        __this.sessions.push(session);
        this.getProxyExtender = function(cb, name) {
          return session.proxyRequested(name, cb);
        };
        this.pageInvoke = function(cb, name, args, pageName) {
          return session.getPage(pageName).invoke(cb, name, args);
        };
        this.setSubmitData = function(cb, data) {
          session.setSubmitData(data);
          return cb();
        };
        return this.setCurrentPage = function(cb, name) {
          session.setCurrentPage(name);
          return cb();
        };
      });
    };

    return Server;

  })(Widlib.Client);

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
        return cb(p.proxyExtender);
      }).done();
    };

    Session.prototype.sendData = function(name) {
      var deferred;
      deferred = Q.defer();
      this.pipeClient.setData(function() {
        return deferred.resolve();
      }, name, this.data[name]);
      return deferred.promise;
    };

    Session.prototype.defaults = {
      pages: [],
      show: true,
      formSelector: "form[wl-submit]",
      linkSelector: "a[wl-submit]",
      data: {},
      submits: {},
      backStack: []
    };

    function Session(options) {
      if (options == null) {
        options = {};
      }
      this.rnd = Math.random();
      this.options = _.chain(options).clone().defaults(this.defaults).value();
      this.setProperties(this.options);
      this.initPages(this.options.pages);
      if (this.options.show && this.el) {
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
      var _results,
        _this = this;
      this.pages = [];
      this.initPagesArr = _(hash).map(function(value, key) {
        return _.chain(value).clone().defaults({
          name: key,
          session: _this,
          app: _this.app
        }).value();
      });
      _results = [];
      while (this.initPagesArr[0]) {
        _results.push(this.initPage(0));
      }
      return _results;
    };

    Session.prototype.initPage = function(num) {
      var hash, page;
      hash = this.initPagesArr.splice(num, 1)[0];
      page = new Widlib.Page(hash);
      this.pages.push(page);
      return page;
    };

    Session.prototype.show = function() {
      return Q(this.getCurrentPage()).then(function(page) {
        return page.enter();
      }).done();
    };

    Session.prototype.getCurrentPage = function() {
      var _this = this;
      if (this.currentPage) {
        return this.currentPage;
      }
      return Q(this._firstPage()).then(function(page) {
        return _this.setCurrentPage(page);
      });
    };

    Session.prototype._firstPage = function() {
      var page;
      if (page = _.result(this, "firstPage") || this.pages[0]) {
        return this.getPage(page);
      }
      return this.getProxy();
    };

    Session.prototype.getPageByName = function(name) {
      return (_(this.pages).find(function(p) {
        return p.name === name;
      })) || this.getProxy(name);
    };

    Session.prototype.getNextPage = function() {
      if (this.currentPage.constructor === Widlib.Page) {
        return this.pages[_(this.pages).indexOf(this.currentPage) + 1];
      } else {
        return this.getNextProxy();
      }
    };

    Session.prototype.getBackPage = function() {
      var back;
      while ((back = this.backStack.pop()) === this.currentPage) {}
      this.backStack.push(back);
      return back;
    };

    Session.prototype.getNextProxy = function() {
      return this.getProxy(true);
    };

    Session.prototype.getProxy = function(name) {
      return this.app.getProxy(name);
    };

    Session.prototype.getPage = function(page) {
      if (page === "_previous") {
        return this.getPreviousPage();
      } else if (page === "_current" || !page) {
        return this.getCurrentPage();
      } else if (page === "_next" || page === true) {
        return this.getNextPage();
      } else if (page === "_back" || page === false) {
        return this.getBackPage();
      } else if (_.isString(page)) {
        return this.getPageByName(page);
      } else {
        return page;
      }
    };

    Session.prototype.setCurrentPage = function(page) {
      return this.currentPage = this.getPage(page);
    };

    Session.prototype.setSubmitData = function(data) {
      return _(this.submits).extend(data);
    };

    Session.prototype.template = function(page) {
      return this.templates["templates/" + page.name](page) || this.templates['templates/main'](page) || page.body;
    };

    Session.prototype.getForm = function() {
      return $(this.formSelector);
    };

    Session.prototype.getLinks = function() {
      return $(this.linkSelector);
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
    window._ = _;
    window.Q = Q;
  }

}).call(this);
