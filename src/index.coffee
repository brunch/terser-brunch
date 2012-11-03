sysPath = require 'path'
uglify = require 'uglify-js'

module.exports = class UglifyMinifier
  brunchPlugin: yes
  type: 'javascript'

  constructor: (@config) ->
    @options = @config?.plugins?.uglify ? {}

  minify: (data, path, callback) ->
    try
      minified = uglify data, @options
    catch err
      error = "JS minify failed on #{path}: #{err}"
    process.nextTick ->
      callback error, (minified or data)
