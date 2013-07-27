var grunt = require('grunt');

exports.liquid = {
  compile: function(test) {
    'use strict';

    var files = ["index.html", "products.html"];
    test.expect(files.length);

    files.forEach(function(file) {
      var actual = grunt.file.read('tmp/actual/' + file);
      var expected = grunt.file.read('test/expected/' + file);
      test.equal(expected, actual, 'should compile liquid templates to html');
    });

    test.done();
  }
};