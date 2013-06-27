describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
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

    plugin.optimize(content, '', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data).to.equal(expected);
      done();
    });
  });

  it('should produce source maps', function(done) {
    plugin = new Plugin({sourceMaps: true});

    var content = '(function() {var first = 5; window.second = first;})()';
    var expected = '!function(){var n=5;window.second=n}();';
    var expectedMap = '{"version":3,"file":".map","sources":["?"],"names":["first","window","second"],"mappings":"CAAA,WAAa,GAAIA,GAAQ,CAAGC,QAAOC,OAASF"}';

    plugin.optimize(content, '', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.code).to.equal(expected);
      expect(data.map).to.equal(expectedMap);
      done();
    });
  });
});
