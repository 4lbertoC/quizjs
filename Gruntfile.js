'use strict';
module.exports = function(grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    browserify: {
      master: {
        files: {
          'dist/quizjs-master.js': ['clients/quizjs-master.js']
        },
        options: {
          banner: grunt.file.read('./clients/banner-master.txt'),
          browserifyOptions: {
            standalone: 'QuizJsMaster'
          }
        }
      },
      player: {
        files: {
          'dist/quizjs-player.js': ['clients/quizjs-player.js']
        },
        options: {
          banner: grunt.file.read('./clients/banner-player.txt'),
          browserifyOptions: {
            standalone: 'QuizJsPlayer'
          }
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      js: {
        src: ['*.js', 'clients/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    mochacli: {
      options: {
        reporter: 'nyan',
        bail: true
      },
      all: ['test/*.js']
    },
    uglify: {
      clients: {
        files: {
          'dist/quizjs-master.min.js': 'dist/quizjs-master.js',
          'dist/quizjs-player.min.js': 'dist/quizjs-player.js'
        },
        options: {
          preserveComments: 'some'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: '<%= jshint.js.src %>',
        tasks: ['jshint:js', 'mochacli']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochacli']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochacli', 'browserify', 'uglify']);
};