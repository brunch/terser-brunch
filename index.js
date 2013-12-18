var sysPath = require('path');
var uglify = require('uglify-js');

var extend = function(object, source) {
  for (var key in source) object[key] = source[key];
  return object;
};

function UglifyJSOptimizer(config) {
  if (config == null) config = {};
  var options = config.plugins && config.plugins.uglify;
  this.options = options ? extend({}, options) : {};
  this.options.fromString = true;
  this.options.sourceMaps = !!config.sourceMaps;
}

UglifyJSOptimizer.prototype.brunchPlugin = true;
UglifyJSOptimizer.prototype.type = 'javascript';

UglifyJSOptimizer.prototype.optimize = function(data, path, callback) {
  var error, optimized;
  this.options.outSourceMap = this.options.sourceMaps ?
    '' + path + '.map' : void 0;
  try {
    optimized = uglify.minify(data, this.options);
  } catch (_error) {
    error = "JS minification failed on " + path + ": " + _error;
  } finally {
    if (error) return callback(error);
    var result = optimized && this.options.sourceMaps ? {
      data: optimized.code,
      map: optimized.map
    } : {
      data: optimized.code
    };
    callback(null, result);
  }
};

module.exports = UglifyJSOptimizer;
