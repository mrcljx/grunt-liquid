/*
 * grunt-liquid
 *
 * Copyright (c) 2013 Marcel Jackwerth, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
          'Gruntfile.js',
          '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    
    coffeelint: {
      all: ["src/**/*.coffee"]
    },
    
    coffee: {
      compile: {
        files: {
          "tasks/index.js": "src/index.coffee",
          "tasks/lib/liquid-ext.js": "src/lib/liquid-ext.coffee"
        }
      }
    },

    run_grunt: {
      liquid: {
        src: ["Gruntfile-test.js"]
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    clean: {
      dist: ['tasks']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-internal');
  grunt.loadNpmTasks('grunt-run-grunt');

  grunt.registerTask('lint', ['coffeelint', 'jshint']);
  // grunt.hideTask('lint');
  
  grunt.registerTask('compile', ['clean', 'coffee']);
  // grunt.hideTask('compile');
  
  grunt.registerTask('test', ['compile', 'lint', 'run_grunt:liquid', 'nodeunit']);
  grunt.registerTask('default', ['test']);
};