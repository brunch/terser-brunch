/* eslint-env mocha */
'use strict';
require('chai/register-should');
const Plugin = require('.');

const path = 'file.js';
const data = '(function() {var first = 5; window.second = first;})()';
const uglified = 'window.second=5;';
const modern = `
  // All credits to Netflix for providing this approach to ES6 feature detection.
  /* https://gist.github.com/DaBs/89ccc2ffd1d435efdacff05248514f38 */

  class ಠ_ಠ extends Array {
    constructor(j = "a", ...c) {
      const q = (({u: e}) => {
        return { [\`s\${c}\`]: Symbol(j) };
      })({});

      super(j, q, ...c);
    }
  }

  new Promise((f) => {
    const a = function* (){
      return "\u{20BB7}".match(/./u)[0].length === 2 || true;
    };

    for (let vre of a()) {
      const [uw, as, he, re] = [
        new Set(),
        new WeakSet(),
        new Map(),
        new WeakMap(),
      ];
      break;
    }

    f(new Proxy({}, {
      get: (han, h) => h in han ? han[h] : "42".repeat(0o10)
    }),);
  }).then(bi => new ಠ_ಠ(bi.rd));
`;

describe('uglify-js-brunch', () => {
  let plugin;

  beforeEach(() => {
    plugin = new Plugin({
      plugins: {},
    });
  });

  it('should have #optimize method', () => {
    plugin.should.respondTo('optimize');
  });

  it('should compile and produce valid result', () => {
    plugin.optimize({data, path}).should.eql({data: uglified});
  });

  it('should optimize modern JavaScript', () => {
    const code = plugin.optimize({data: modern, path}).data;

    // eslint-disable-next-line no-eval
    return eval(code).then(res => {
      res.should.be.an('array');
      res[0].should.equal('4242424242424242');
      res[1].s.should.be.a('symbol');
    });
  });

  it('should produce source maps', () => {
    plugin = new Plugin({
      sourceMaps: true,
      plugins: {},
    });

    plugin.optimize({data, path}).should.eql({
      data: uglified,
      map: '{"version":3,"sources":["0"],"names":["window","second"],"mappings":"AAA4BA,OAAOC,OAAV"}',
    });
  });

  it('should return ignored files as-is', () => {
    const path = 'ignored.js';
    const map = '{"version": 3}';

    plugin = new Plugin({
      plugins: {
        uglify: {
          ignored: path,
        },
      },
    });

    plugin.optimize({data, path, map})
      .should.eql({data, map});
  });

  it('should match ignored files correctly', () => {
    plugin = new Plugin({
      plugins: {
        uglify: {
          ignored: 'ignored.js',
        },
      },
    });

    plugin.optimize({data, path: 'file.js'})
      .should.eql({data: uglified});
  });
});
