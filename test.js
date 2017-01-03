/* eslint no-undef: 0 */
'use strict';

const expect = require('chai').expect;
const Plugin = require('./');

describe('Plugin', () => {
  let plugin;

  beforeEach(() => {
    plugin = new Plugin(Object.freeze({}));
  });

  it('should be an object', () => expect(plugin).to.be.ok);

  it('should has #optimize method', () => {
    expect(plugin.optimize).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', done => {
    const content = '(function() {var first = 5; window.second = first;})()';
    const expected = '!function(){var n=5;window.second=n}();';

    plugin.optimize({data: content})
      .then(data => {
        expect(data).to.eql({data: expected});
        done();
      })
      .catch(error => expect(error).not.to.be.ok);
  });

  it('should produce source maps', done => {
    plugin = new Plugin({sourceMaps: true});

    const content = '(function() {var first = 5; window.second = first;})()';
    const expected = '!function(){var n=5;window.second=n}();';
    const expectedMap = '{"version":3,"file":"file.js.map","sources":["?"],"names":["first","window","second"],"mappings":"CAAA,WAAa,GAAIA,GAAQ,CAAGC,QAAOC,OAASF"}';

    plugin.optimize({data: content, path: 'file.js'})
      .then(data => {
        expect(data.data).to.equal(expected);
        expect(data.map).to.equal(expectedMap);
        done();
      })
      .catch(error => expect(error).not.to.be.ok, done());
  });

  it('should ignore ignored files', done => {
    plugin = new Plugin({
      plugins: {
        uglify: {
          ignored: /ignoreMe\.js/,
        },
      },
    });

    const content = '(function() {var first = 5; window.second = first;})()';
    const expected = content;
    const map = 'someDummyMap';

    plugin.optimize({data: content, path: 'ignoreMe.js', map})
      .then(data => {
        expect(data).to.eql({data: expected, map});
        done();
      })
      .catch(error => expect(error).not.to.be.ok);

  });

  it('should not ignore non-ignored files', done => {
    plugin = new Plugin({
      plugins: {
        uglify: {
          ignored: /ignoreMe\.js/,
        },
      },
    });

    const content = '(function() {var first = 5; window.second = first;})()';
    const expected = '!function(){var n=5;window.second=n}();';

    plugin.optimize({data: content, path: 'uglifyMe.js'})
      .then(data => {
        expect(data).to.eql({data: expected});
        done();
      })
      .catch(error => expect(error).not.to.be.ok);
  });
});
