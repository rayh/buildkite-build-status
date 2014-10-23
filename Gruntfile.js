'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        express: {
          web: {
            options: {
              script: 'app/app.js'
            }
          }
        },

        watch: {
          stylesSass: {
            files: ['sass/{,*/}*.sass'],
            tasks: ['sass']
          },
          web: {
            files: [
            ],
            tasks: [
              'express:web'
            ],
            options: {
              nospawn: true, //Without this option specified express won't be reloaded
              atBegin: true,
            }
          }
        },

        sass: {
          dist: {
            files: [{
              expand: true,
              cwd: 'sass',
              src: ['*.sass'],
              dest: 'public/styles',
              ext: '.css'
            }],
          }
        },

        parallel: {
          web: {
            options: {
              stream: true
            },
            tasks: [{
              grunt: true,
              args: ['watch:stylesSass']
            }, {
              grunt: true,
              args: ['watch:web']
            }]
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('web', 'launch webserver and watch tasks', [
        'parallel:web',
    ]);
    grunt.registerTask('default', ['web']);
};
