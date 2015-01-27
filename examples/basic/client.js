(function() {
  $(function() {
    var client;
    return client = new Widlib.Client({
      fallback: "/server",
      el: $('#widlib')[0]
    });
  });

}).call(this);
