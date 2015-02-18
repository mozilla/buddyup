'use strict';

/* global asyncStorage, Notif, SumoDB */

require('/test/unit/mocks/mock_async_storage.js');
require('/test/unit/mocks/mock_sumo_db.js');

require('/js/utils.js');
require('/js/notifications.js');

var mocksFor = new MocksHelper([
  'asyncStorage',
  'SumoDB'
]).init();

suite('notifications', function() {
  this.timeout(500);

  mocksFor.attachTestHelpers();

  suite('ensure_endpoint', function() {
    const FAKE_ENDPOINT = 'fake_endpoint';
    var register_request = {};

    setup(function() {
      navigator.push = {
        register: function() {
          setTimeout(function() {
            register_request.onsuccess();
          });
          register_request.result = FAKE_ENDPOINT;
          return register_request;
        }
      };

      this.sinon.stub(asyncStorage, 'getItem').returns(Promise.resolve());
      this.sinon.stub(asyncStorage, 'setItem').returns(Promise.resolve());
      this.sinon.stub(SumoDB, 'register_push_endpoint')
        .returns(Promise.resolve());
      this.sinon.spy(navigator.push, 'register');
    });

    test('gets an endpoint and saves it', function(done) {
      Notif.ensure_endpoint().then(function() {
        sinon.assert.calledWith(asyncStorage.setItem,
          'endpoint', FAKE_ENDPOINT);
        sinon.assert.calledWith(SumoDB.register_push_endpoint, FAKE_ENDPOINT);
      }).then(done, done);
    });

    test('does not get a new endpoint if called twice quickly', function(done) {
      Promise.all([Notif.ensure_endpoint(), Notif.ensure_endpoint()])
      .then(function() {
        sinon.assert.calledOnce(navigator.push.register);
        sinon.assert.calledOnce(asyncStorage.setItem);
        sinon.assert.calledOnce(SumoDB.register_push_endpoint);
      }).then(done, done);
    });

    test('does not get a new endpoint if we already have one', function(done) {
      asyncStorage.getItem.restore();
      this.sinon.stub(asyncStorage, 'getItem')
        .returns(Promise.resolve(FAKE_ENDPOINT));

      Notif.ensure_endpoint().then(function() {
        sinon.assert.notCalled(navigator.push.register);
        sinon.assert.notCalled(asyncStorage.setItem);
        sinon.assert.notCalled(SumoDB.register_push_endpoint);
      }).then(done, done);
    });
  });

  suite('clear_endpoint', function() {
    test('should clear from client', function(done) {
      this.sinon.stub(asyncStorage, 'removeItem').returns(Promise.resolve());
      Notif.clear_endpoint().then(function() {
        sinon.assert.calledWith(asyncStorage.removeItem, 'endpoint');
      }).then(done, done);
    });
  });
});
