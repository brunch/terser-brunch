sysPath = require 'path'
uglify = require 'uglify-js'

module.exports = class UglifyMinifier
  brunchPlugin: yes
  type: 'javascript'

  constructor: (@config) ->
    @options = clone @config?.plugins?.uglify
    @options = {} unless typeof @options is 'object'
    @options.fromString = yes

  optimize: (data, path, callback) =>
    try
      optimized = uglify.minify(data, @options).code
    catch err
      error = "JS minify failed on #{path}: #{err}"
    process.nextTick ->
      callback error, (optimized or data)

clone = (obj) ->
  return obj if not obj? or typeof obj isnt 'object'
  copied = new obj.constructor()
  copied[key] = clone val for key, val of obj
  copied
