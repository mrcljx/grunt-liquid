module.exports = function(grunt) {

  grunt.initConfig({
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
      tests: {
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: '*.liquid', dest: 'tmp/actual/', ext: '.html'}
        ]
      }
    },

    clean: {
      liquid: ['tmp/**/*.html']
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('default', ['clean', 'liquid']);

};