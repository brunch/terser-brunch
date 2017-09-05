/* eslint-env mocha */
'use strict';
require('chai/register-should');
const Plugin = require('.');

const data = '(function() {var first = 5; window.second = first;})()';
const uglified = 'window.second=5;';

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
    plugin.optimize({data, path: 'file.js'})
      .should.eql({data: uglified});
  });

  it('should produce source maps', () => {
    plugin = new Plugin({
      sourceMaps: true,
      plugins: {},
    });

    plugin.optimize({data, path: 'file.js'}).should.eql({
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
