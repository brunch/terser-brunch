sysPath = require 'path'
uglify = require 'uglify-js'

module.exports = class UglifyMinifier
  brunchPlugin: yes
  type: 'javascript'

  constructor: (@config) ->
    @options = fromString: yes
    
    if typeof @config?.plugins?.uglify == 'object'
      @options[key] = value for key, value of @config.plugins.uglify

  optimize: (data, path, callback) =>
    try
      optimized = uglify.minify(data, @options).code
    catch err
      error = "JS minify failed on #{path}: #{err}"
    process.nextTick ->
      callback error, (optimized or data)
