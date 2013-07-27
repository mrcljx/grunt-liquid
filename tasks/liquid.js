/*
 * grunt-liquid
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */


'use strict';

var path = require("path");

module.exports = function(grunt) {
  var Liquid    = require('./lib/liquid-ext');

  grunt.registerMultiTask('liquid', 'Compile liquid templates.', function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      includes: ''
    });

    grunt.verbose.writeflags(options, 'Options');

    this.files.forEach(function(fp) {
      var srcFiles = fp.src;
      var content  = grunt.file.read(srcFiles);

      var ext = path.extname(srcFiles);
      var dir = path.dirname(fp.src);

      var parsePromise = Liquid.Template.extParse(content, function(subFilepath, cb) {
        cb(null, grunt.file.read(path.join(options.includes, subFilepath + ext)));
      });

      parsePromise.done(function(template) {
        var promise = template.render(options);

        promise.done(function(output) {
          grunt.file.write(fp.dest, output);
          grunt.log.writeln('File "' + fp.dest + '" created.');
        });

        promise.fail(function() {
          grunt.log.warn('Destination not written because compiled files were empty.');
        });

        promise.fin(done);
      });

      parsePromise.fail(function(e) {
        grunt.log.error(e);
        grunt.fail.warn('Liquid failed to compile ' + srcFiles + '.');
        done();
      });
    });

  });
};

