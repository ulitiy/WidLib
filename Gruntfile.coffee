module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    meta:
      banner:
        '// widlib\n' +
        '// version: <%= pkg.version %>\n' +
        '// author: <%= pkg.author %>\n' +
        '// license: <%= pkg.license %>\n'

    clean: ['spec/js', 'js']

    jasmine:
      all:
        src: ['js/widlib.browser.js','js/templates.js']
        options:
          specs: 'spec/js/**/*.js'
          vendor: 'spec/vendor/**/*.js'

    coffee:
      test:
        expand: true
        flatten: true
        cwd: 'spec/src/'
        src: '*.spec.coffee'
        dest: 'spec/js'
        ext: '.spec.js'
      main:
        options:
          join: true
        files:
          'js/widlib.js': 'src/*.coffee'
      globus:
        expand: true
        cwd: 'examples/globus'
        src: '**/*.coffee'
        dest: 'examples/globus'
        ext: '.js'

    browserify:
      all:
        files:
          'js/widlib.browser.js': 'js/widlib.js'

    coffee_jshint:
      options:
        globals: ['Widlib','_','$','Q','module','require','Connection','window','exports']
      source:
        src: 'src/**/*.coffee'

    concat:
      all:
        options:
          banner: '<%= meta.banner %>'
        files:
          'js/widlib.js': 'js/widlib.js'

    handlebars:
      main:
        files:
          'js/templates.js': 'templates/*.hbs'
      globus:
        options:
          node: true
          processName: (filePath) ->
            "templates/"+filePath.match(/\/(\w*).hbs/)[1]
        files:
          'examples/globus/public/javascripts/templates.js': 'examples/globus/templates/*.hbs'

    uglify:
      options:
        banner: '<%= meta.banner %>'
        # report: 'gzip'
      build:
        files:
          'js/widlib.min.js': 'js/widlib.js'
          'js/widlib.browser.min.js': 'js/widlib.browser.js'

    copy:
      globus:
        files:
          'examples/globus/widlib.js': 'js/widlib.js'
          'examples/globus/public/javascripts/widlib.browser.js': 'js/widlib.browser.js'

    nodemon:
      globus:
        options:
          file: 'examples/globus/server.js'
          nodeArgs: ['--debug']

    'node-inspector':
      globus:
        options:
          'web-port': 9998

    concurrent:
      globus:
        tasks: ['nodemon', 'node-inspector', 'watch']
        options:
          logConcurrentOutput: true

    # compress:
    #   main:
    #     options:
    #       mode: 'gzip'
    #       level: 9
    #     expand: true
    #     cwd: 'examples/globus/public'
    #     src: ['**/*']
    #     dest: 'examples/globus/public_compressed'

    watch:
      all:
        # files: ['src/**/*.coffee', 'spec/src/**/*.coffee', 'templates/*.hbs', 'examples/**/*.coffee']
        files: ['**/*.coffee','**/*.hbs']
        tasks: ['clean', 'build', 'copy', 'spec']

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-coffee-jshint'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-handlebars'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-nodemon'
  grunt.loadNpmTasks 'grunt-concurrent'
  grunt.loadNpmTasks 'grunt-node-inspector'
  # grunt.loadNpmTasks 'grunt-contrib-compress'

  grunt.registerTask 'default', ['concurrent']
  grunt.registerTask 'spec',    ['jasmine']#, 'coffee_jshint']
  grunt.registerTask 'build',   ['coffee', 'browserify', 'concat', 'handlebars', 'uglify']
