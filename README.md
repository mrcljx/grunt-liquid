# [grunt](http://gruntjs.com)-liquid [![Build Status](https://travis-ci.org/sirlantis/grunt-liquid.png?branch=master)](https://travis-ci.org/sirlantis/grunt-liquid)

> Compile Liquid (node-liquid) templates.

## Getting Started

If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```sh
npm install --save-dev grunt-liquid
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-liquid');
```

*Tip: the [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks) module makes it easier to load multiple grunt tasks.*

[grunt]: http://gruntjs.com
[Getting Started]: https://github.com/gruntjs/grunt/wiki/Getting-started


## Documentation

See the grunt [docs](https://github.com/gruntjs/grunt/wiki) on how to [configure tasks](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) and more advanced usage.

### Example

```js
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
    pages: {
      files: [
        { expand: true, flatten: true, src: 'src/*.liquid', dest: 'dest/', ext: '.html' }
      ]
    }
  },
});

grunt.loadNpmTasks('grunt-liquid');
grunt.registerTask('default', ['liquid']);
```

### Options

Options beside the following are treated as variables that are injected into the template.

#### includes

Type: `Array` or `String`  
Default: `""`

## License

MIT © Marcel Jackwerth