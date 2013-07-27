/*
 * grunt-liquid
 *
 * Copyright (c) 2013 Marcel Jackwerth, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
          'Gruntfile.js',
          'tasks/*.js',
          '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Configuration to be run (and then tested).
    liquid: {
      options: {
        includes: 'test/fixtures/inc',
        products: [
          {
            name: "Wonderflonium",
            price: "$9.99",
            description: "Great for building freeze rays!"
          }
        ]
      },
      pages: {
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: '*.liquid', dest: 'tmp/actual/', ext: '.html'}
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: {
      dist: ['dist/**/*.{md,html}', 'tmp/*.html']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'default', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'clean', 'liquid']);

  // Build readme.
  grunt.registerTask('readme', ['build-contrib']);

};