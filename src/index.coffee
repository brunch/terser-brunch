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

  optimize: (data, path, callback) ->
    @options.outSourceMap = if @options?.sourceMaps
      "#{path}.map"
    else
      undefined

    try
      optimized = uglify.minify(data, @options)
    catch err
      error = "JS minify failed on #{path}: #{err}"
    finally
      result = if optimized and @options?.sourceMaps
        data: optimized.code
        map: optimized.map
      else
        data: optimized.code
      callback error, (result or data)
