var sysPath = require('path');
var uglify = require('uglify-js');

var extend = function(object, source) {
  var value;
  for (var key in source) {
    value = source[key];
    object[key] = (typeof value === 'object') ?
      (Array.isArray(value) ? value.slice() : extend({}, value)) :
      value;
  }
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

UglifyJSOptimizer.prototype.optimize = function(args, callback) {
  var error, optimized, data, path;
  data = args.data;
  path = args.path;

  try {
    this.options.inSourceMap = JSON.parse(args.map);
  } catch (_e) {}

  this.options.outSourceMap = this.options.sourceMaps ?
    path + '.map' : undefined;

  try {
    optimized = uglify.minify(data, this.options);
  } catch (_error) {
    error = 'JS minification failed on ' + path + ': ' + _error;
  } finally {
    if (error) return callback(error);
    var result = optimized && this.options.sourceMaps ? {
      data: optimized.code,
      map: optimized.map
    } : {data: optimized.code};
    callback(null, result);
  }
};

module.exports = UglifyJSOptimizer;
