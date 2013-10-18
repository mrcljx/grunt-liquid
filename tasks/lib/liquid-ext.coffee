Q = require('q')
module.exports = Liquid = require('liquid-node')

Liquid.Template.registerTag "block", do ->
  class BlockBlock extends Liquid.Block
    Syntax = /(\w+)/
    SyntaxHelp = "Syntax Error in 'block' - Valid syntax: block [templateName]"

    constructor: (tagName, markup, tokens, template) ->
      match = Syntax.exec(markup)
      throw new Liquid.SyntaxError(SyntaxHelp) unless match

      template.exportedBlocks or= {}
      template.exportedBlocks[match[1]] = @

      super

    replace: (block) ->
      @nodelist = block.nodelist

Liquid.Template.registerTag "extends", do ->
  class ExtendsTag extends Liquid.Tag
    Syntax = /([a-z0-9\/\\_-]+)/i
    SyntaxHelp = "Syntax Error in 'extends' - Valid syntax: extends [templateName]"

    constructor: (tagName, markup, tokens, template) ->
      match = Syntax.exec(markup)
      throw new Liquid.SyntaxError(SyntaxHelp) unless match

      template.extends = match[1]
      super

    render: (context) ->
      ""

Liquid.Template.registerTag "include", do ->
  class IncludeTag extends Liquid.Tag
    Syntax = /([a-z0-9\/\\_-]+)/i
    SyntaxHelp = "Syntax Error in 'include' - Valid syntax: include [templateName]"

    constructor: (tagName, markup, tokens, template) ->
      match = Syntax.exec(markup)
      throw new Liquid.SyntaxError(SyntaxHelp) unless match

      @filepath = match[1]
      deferred = Q.defer()
      @included = deferred.promise

      template.importer @filepath, (err, src) ->
        subTemplate = Liquid.Template.extParse src, template.importer
        subTemplate.then (t) -> deferred.resolve t

      super

    render: (context) ->
      @included.then (i) -> i.render context

Liquid.Template.extParse = (src, importer) ->
  baseTemplate = new Liquid.Template
  baseTemplate.importer = importer
  baseTemplate.parse src

  return Q(baseTemplate) unless baseTemplate.extends

  stack = [baseTemplate]
  depth = 0
  deferred = Q.defer()

  walker = (tmpl, cb) ->
    return cb() unless tmpl.extends

    tmpl.importer tmpl.extends, (err, data) ->
      return cb err if err
      return cb "too many `extends`" if depth > 100
      depth++

      Liquid.Template.extParse(data, importer)
        .then((subTemplate) ->
          stack.unshift subTemplate
          walker subTemplate, cb
        )
        .fail((err) -> cb(err ? "Failed to parse template."))

  walker stack[0], (err) =>
    return deferred.reject err if err

    [rootTemplate, subTemplates...] = stack

    # Queries should find the block of the lowest,
    # most specific child.
    #
    # query   | root.a | c1.a | c2.a | result
    # ---------------------------------------
    # a       |        | "C1" |      | "C1"
    # a       | "ROOT" | "C1" | "C2" | "C2"
    #
    subTemplates.forEach (subTemplate) ->

      # blocks
      subTemplateBlocks = subTemplate.exportedBlocks or {}
      rootTemplateBlocks = rootTemplate.exportedBlocks or {}
      rootTemplateBlocks[k]?.replace(v) for own k, v of subTemplateBlocks

    deferred.resolve rootTemplate

  deferred.promise
