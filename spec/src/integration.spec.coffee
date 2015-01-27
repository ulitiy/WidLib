describe 'Widlib', ->
  beforeEach ->
    $("#widlib").remove()
    $('body').append('<div id="widlib"></div>')
  it 'should render first page', ->
    client=null
    runs ->
      client=new Widlib.Client
        pages:
          first:
            body: '<div id="first">first page</div>'
            inputs: [{type: "submit", value: "value", name: "name"}]
        el: $('#widlib')[0]
        template: JST["templates/basic.hbs"]
    waitsFor ->
      $('.body')[0]
    , ".body appear", 100
    # waitsFor ->
    #   client.session.currentPage
    # , "current page is set", 100
    runs ->
      expect($('#widlib')).toContain '#first'
      # expect(client.session.currentPage.constructor).toBe Widlib.Page

  it 'should show next page on submit', ->
    runs ->
      client=new Widlib.Client
        pages:
          first:
            body: '<div id="first">first page</div>'
            inputs: [{type: "submit", value: "value", name: "name"}]
          second:
            body: '<div id="second">second page</div>'
        el: $('#widlib')[0]
        template: JST["templates/basic.hbs"]
    waitsFor ->
      $('.body')[0]
    , ".body should appear", 100
    runs ->
      $('#widlib form').submit()
    waitsFor ->
      $('#second')[0]
    , "#second should appear", 100

  # it 'should show render first remote page'
  #   runs ->
  #     client=new Widlib.Client
  #     el: $('#widlib')[0]
  #     spyOn
