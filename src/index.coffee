sysPath = require 'path'
uglify = require 'uglify-js'

clone = (obj) ->
  return obj if not obj? or typeof obj isnt 'object'
  copied = new obj.constructor()
  copied[key] = clone val for key, val of obj
  copied

module.exports = class UglifyMinifier
  brunchPlugin: yes
  type: 'javascript'

  constructor: (@config) ->
    @options = clone @config?.plugins?.uglify
    @options = {} unless typeof @options is 'object'
    @options.fromString = yes
    @options.outSourceMap = @config.modules.sourceMaps

  optimize: (data, path, callback) =>
    try
      result = uglify.minify(data, @options)
    catch err
      error = "JS minify failed on #{path}: #{err}"
    callback error, (result or data)
