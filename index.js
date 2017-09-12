'use strict';
const uglify = require('uglify-es');
const anymatch = require('anymatch');

const formatError = old => {
  const err = new Error(`L${old.line}:${old.col} ${old.message}`);
  err.name = '';
  err.stack = old.stack;
  return err;
};

class UglifyJSOptimizer {
  constructor(config) {
    this.options = Object.assign({
      sourceMap: !!config.sourceMaps,
    }, config.plugins.uglify);

    this.ignored = anymatch(this.options.ignored);
    delete this.options.ignored;
  }

  optimize(file) {
    if (this.ignored(file.path)) {
      return {
        data: file.data,
        map: file.map && `${file.map}`,
      };
    }

    const options = Object.assign({}, this.options);
    if (file.map) {
      options.sourceMap = {
        content: JSON.stringify(file.map),
        url: `${file.path}.map`,
      };
    }

    const res = uglify.minify(file.data, options);
    if (res.error) throw formatError(res.error);
    if (!res.map) return {data: res.code};

    return {
      data: res.code.replace(/\/\/# sourceMappingURL=\S+$/, ''),
      map: res.map,
    };
  }
}

UglifyJSOptimizer.prototype.brunchPlugin = true;
UglifyJSOptimizer.prototype.type = 'javascript';

module.exports = UglifyJSOptimizer;
