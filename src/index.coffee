sysPath = require 'path'
uglify = require 'uglify-js'

module.exports = class UglifyMinifier
  brunchPlugin: yes
  type: 'javascript'

  constructor: (@config) ->
    @options = fromString: yes
    
    if typeof @config?.plugins?.uglify == 'object'
      for key, value of @config.plugins.uglify
        unless typeof value is 'object' and Object.isFrozen value
          @options[key] = value

  optimize: (data, path, callback) =>
    try
      optimized = uglify.minify(data, @options).code
    catch err
      error = "JS minify failed on #{path}: #{err}"
    process.nextTick ->
      callback error, (optimized or data)
