/*
 * grunt-liquid
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */

'use strict';

var Path = require("path");

module.exports = function(grunt) {
  var _ = grunt.util._;
  var helpers = require('grunt-lib-contrib').init(grunt);
  var Liquid = require('../lib/liquid-ext');

  // content conversion for templates
  var defaultProcessContent = function(content) { return content; };

  // filename conversion for templates
  var defaultProcessName = function(name) { return name.replace('.liquid', ''); };

  grunt.registerMultiTask('liquid', 'Compile liquid templates.', function() {
    var options = this.options({});
    
    grunt.verbose.writeflags(options, 'Options');

    var done = this.async();
    var data = options.data;
    delete options.data;

    // assign transformation functions
    var processContent = options.processContent || defaultProcessContent;
    var processName = options.processName || defaultProcessName;

    this.files.forEach(function(f) {
      var templates = [], filepath = String(f.src), pwd = Path.dirname(f.src);
      var src = processContent(grunt.file.read(filepath));
      var filename = processName(filepath);

      options = grunt.util._.extend(options, { filename: filepath });

      var parsePromise = Liquid.Template.extParse(src, function(subFilepath, cb) {
        cb(null, grunt.file.read(Path.resolve(pwd, subFilepath + ".liquid")));
      });

      parsePromise.done(function(template) {
        var promise = template.render(options);
      
        promise.done(function(output) {
          grunt.file.write(f.dest, output);
          grunt.log.writeln('File "' + f.dest + '" created.');
        });
      
        promise.fail(function() {
          grunt.log.warn('Destination not written because compiled files were empty.');
        })
      
        promise.fin(done);
      });
      
      parsePromise.fail(function() {
        grunt.log.error(e);
        grunt.fail.warn('Liquid failed to compile '+filepath+'.');
        done();
      });
    });

  });

};
