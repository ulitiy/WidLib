(function() {
  var Widlib, ecstatic, http, server, wls;

  http = require('http');

  Widlib = require('../../js/widlib');

  ecstatic = require('ecstatic')(__dirname + '/');

  server = http.createServer(ecstatic);

  server.listen(3000);

  wls = new Widlib.Server({
    pages: {
      first: {
        body: '<div id="first">first page</div>',
        proxyExtender: {
          methods: {},
          signatures: [],
          attributes: {
            name: "first",
            body: "first"
          }
        }
      }
    }
  });

  wls.listen(server, '/server');

}).call(this);
