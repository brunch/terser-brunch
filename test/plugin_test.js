describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok();
  });

  it('should has #beforeWrite method', function() {
    expect(plugin.beforeWrite).to.be.a(Function);
  });

  it('should compile and produce valid result', function(done) {
    var content = '';
    var expected = '';

    plugin.compile(content, '', function(error, data) {
      expect(error).not.to.be.ok();
      expect(data).to.equal(expected)
      done();
    });
  });
});
