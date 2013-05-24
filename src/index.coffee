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
    @options = (clone @config?.plugins?.uglify) or {}
    @options.fromString = yes
    @options.sourceMaps = @config?.sourceMaps

  optimize: (data, path, callback) =>
    try
      optimized = uglify.minify(data, @options)
    catch err
      error = "JS minify failed on #{path}: #{err}"
    finally
      result = if optimized and @options.sourceMaps
        optimized
      else
        optimized.code
      callback error, (result or data)
