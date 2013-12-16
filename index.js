var sysPath = require('path');
var uglify = require('uglify-js');

var clone = function(obj) {
  var copied, key, val;
  if ((obj == null) || typeof obj !== 'object') {
    return obj;
  }
  copied = new obj.constructor();
  for (key in obj) {
    val = obj[key];
    copied[key] = clone(val);
  }
  return copied;
};

function UglifyMinifier(config) {
  if (config == null) config = {};
  var options = config.plugins && config.plugins.uglify;
  this.options = options ? clone(options) : {};
  this.options.fromString = true;
  this.options.sourceMaps = !!config.sourceMaps;
}

UglifyMinifier.prototype.brunchPlugin = true;
UglifyMinifier.prototype.type = 'javascript';

UglifyMinifier.prototype.optimize = function(data, path, callback) {
  var error, optimized, result;
  this.options.outSourceMap = this.options.sourceMaps ?
    "" + path + ".map" : void 0;
  try {
    optimized = uglify.minify(data, this.options);
  } catch (_error) {
    error = "JS minify failed on " + path + ": " + _error;
  } finally {
    if (error) return callback(error);
    result = optimized && this.options.sourceMaps ? {
      data: optimized.code,
      map: optimized.map
    } : {
      data: optimized.code
    };
    callback(null, result || data);
  }
};

module.exports = UglifyMinifier;
