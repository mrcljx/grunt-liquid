#
# grunt-liquid
# http://gruntjs.com/
#
# Copyright (c) 2013 Marcel Jackwerth
# Licensed under the MIT license.
#
path = require "path"

module.exports = (grunt) ->
  Liquid = require("./lib/liquid-ext")
  grunt.registerMultiTask "liquid", "Compile liquid templates.", ->
    done = @async()

    # Merge task-specific and/or target-specific options with these defaults.
    options = @options includes: ""
    grunt.verbose.writeflags options, "Options"

    @files.forEach (fp) ->
      srcFiles = fp.src
      content = grunt.file.read(srcFiles)
      ext = path.extname(srcFiles)
      dir = path.dirname(fp.src)

      parsePromise = Liquid.Template.extParse content, (subFilepath, cb) ->
        includes = options.includes
        includes = [includes] unless Array.isArray includes

        found = false
        includes.some (include) ->
          includePath = path.join(include, subFilepath + ext)

          if grunt.file.exists includePath
            found = true
            cb null, grunt.file.read(includePath)

          found

        cb "Not found." unless found

      parsePromise.then (template) ->
        template.render(options)
        .then (output) ->
          grunt.file.write fp.dest, output
          grunt.log.writeln "File \"#{fp.dest}\" created."
        .catch (e) ->
          grunt.log.warn e
        .finally done

      parsePromise.catch (e) ->
        grunt.log.error e
        grunt.fail.warn "Liquid failed to compile #{srcFiles}."
        done()