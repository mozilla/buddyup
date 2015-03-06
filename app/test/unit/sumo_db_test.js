'use strict';

/* global SumoDB */

require('/js/settings.js');

require('/js/sumo_db.js');

suite('sumo_db', function() {
  this.timeout(500);

  suite('get_suggestions', function() {
    var fake_xhr;
    setup(function() {
      fake_xhr = this.sinon.useFakeXMLHttpRequest();
    });

    teardown(function() {
      fake_xhr.restore();
    });

    test('normal case', function(done) {
      SumoDB.get_suggestions('foo', () => done());
      fake_xhr.requests[0].respond(200, {}, '{"foo":"bar"}');
    });

    test('request 2 responds before request 1', function(done) {
      var should_be_called_spy = this.sinon.spy();
      var should_not_be_called_spy = this.sinon.spy();
      SumoDB.get_suggestions('foo', should_not_be_called_spy);
      SumoDB.get_suggestions('foob', should_be_called_spy);
      SumoDB.get_suggestions('fooba', should_be_called_spy);

      var abort_spy = this.sinon.spy(fake_xhr.requests[0], 'abort');
      fake_xhr.requests[1].respond(200, {}, '{"foob":"bar"}');
      fake_xhr.requests[0].respond(200, {}, '{"foo":"bar"}');
      fake_xhr.requests[2].respond(200, {}, '{"fooba":"bar"}');

      setTimeout(function() {
        // Wait till promises are resolved
        sinon.assert.calledTwice(should_be_called_spy);
        sinon.assert.notCalled(should_not_be_called_spy);

        sinon.assert.calledOnce(abort_spy);

        done();
      });
    });

  });
});
