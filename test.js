var expect = require('chai').expect;
var Plugin = require('./');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin(Object.freeze({}));
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #optimize method', function() {
    expect(plugin.optimize).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', function(done) {
    var content = '(function() {var first = 5; window.second = first;})()';
    var expected = '!function(){var n=5;window.second=n}();';

    plugin.optimize({data: content}, function(error, data) {
      expect(error).not.to.be.ok;
      expect(data).to.eql({data: expected});
      done();
    });
  });

  it('should produce source maps', function(done) {
    plugin = new Plugin({sourceMaps: true});

    var content = '(function() {var first = 5; window.second = first;})()';
    var expected = '!function(){var n=5;window.second=n}();';
    var expectedMap = '{"version":3,"file":"file.js.map","sources":["?"],"names":["first","window","second"],"mappings":"CAAA,WAAa,GAAIA,GAAQ,CAAGC,QAAOC,OAASF"}';

    plugin.optimize({data: content, path:'file.js'}, function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      expect(data.map).to.equal(expectedMap);
      done();
    });
  });

  it('should ignore ignored files', function(done) {
    plugin = new Plugin({
      plugins: {
        uglify: {
          ignored: /ignoreMe\.js/
        }
      }
    });

    var content = '(function() {var first = 5; window.second = first;})()';
    var expected = content;
    var map = 'someDummyMap';

    plugin.optimize({data: content, path: 'ignoreMe.js', map: map}, function(error, data) {
      expect(error).not.to.be.ok;
      expect(data).to.eql({data: expected, map: map});
      done();
    });

  });

  it('should not ignore non-ignored files', function(done) {
    plugin = new Plugin({
      plugins: {
        uglify: {
          ignored: /ignoreMe\.js/
        }
      }
    });

    var content = '(function() {var first = 5; window.second = first;})()';
    var expected = '!function(){var n=5;window.second=n}();';

    plugin.optimize({data: content, path: 'uglifyMe.js'}, function(error, data) {
      expect(error).not.to.be.ok;
      expect(data).to.eql({data: expected});
      done();
    });
  });
});
