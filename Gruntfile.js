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
          'dist/implementations/socket.io/clients/quizjs-master.js': ['implementations/socket.io/clients/quizjs-master.js']
        },
        options: {
          banner: grunt.file.read('./implementations/socket.io/clients/banner-master.txt'),
          browserifyOptions: {
            standalone: 'QuizJsMaster'
          }
        }
      },
      player: {
        files: {
          'dist/implementations/socket.io/clients/quizjs-player.js': ['implementations/socket.io/clients/quizjs-player.js']
        },
        options: {
          banner: grunt.file.read('./implementations/socket.io/clients/banner-player.txt'),
          browserifyOptions: {
            standalone: 'QuizJsPlayer'
          }
        }
      }
    },
    clean: ['./dist'],
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
          'dist/implementations/socket.io/clients/quizjs-master.min.js': 'dist/implementations/socket.io/clients/quizjs-master.js',
          'dist/implementations/socket.io/clients/quizjs-player.min.js': 'dist/implementations/socket.io/clients/quizjs-player.js'
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

  grunt.registerTask('default', ['jshint', 'mochacli', 'clean', 'browserify', 'uglify']);
  grunt.registerTask('dev', ['jshint', 'mochacli']);
};