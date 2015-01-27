describe 'Session', ->
  it 'should set default attributes', ->
    session=new Widlib.Session
    expect(session.pages.length).toBe 0

  describe 'setProperties', ->
    session=new Widlib.Session
    beforeEach ->
      session.setProperties
        el: document.body
        server: '/'
    it 'should set properties', ->
      expect(session.el).toBe document.body
      expect(session.server).toBe '/'

  describe 'initPages', ->
    session=new Widlib.Session
    session.initPages
      # pages:
        page1:
          num: 1
          name: 'page-override1'
        page2:
          num: 2
    it 'should set @pages array', ->
      expect(session.pages.length).toBe 2
      expect(session.pages[0].constructor).toBe Widlib.Page
    it 'should set page properties', ->
      expect(session.pages[0].num).toBe 1
      expect(session.pages[0].session).toBe session
    it 'should set page name property', ->
      expect(session.pages[1].name).toBe 'page2'
    it 'should set page name overrides', ->
      expect(session.pages[0].name).toBe 'page-override1'

  # describe 'show'
  # describe 'currentPage', ->
  #   session=new Widlib.Session
  #     pages:
  #       first:
  #         num: 1
  #   it 'should return first page', ->
  #     expect(session.currentPage().name).toBe 'first'

  describe 'getNextPage', ->
    session=new Widlib.Session
      pages:
        first:
          num: 1
        second:
          num: 2
        third:
          num: 3
    it 'should return next page', ->
      session.currentPage=session.pages[1]
      expect(session.getNextPage().name).toBe 'third'
  # describe 'goTo'
