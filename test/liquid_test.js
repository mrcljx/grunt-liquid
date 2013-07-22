var grunt = require('grunt');

exports.liquid = {
  compile: function(test) {
    'use strict';

    var files = ["liquid.html", "liquid2.html"];
    test.expect(files.length);
    
    files.forEach(function(file) {
      var actual = grunt.file.read('tmp/' + file);
      var expected = grunt.file.read('test/expected/' + file);
      test.equal(expected, actual, 'should compile liquid templates to html');
    });

    test.done();
  }
};