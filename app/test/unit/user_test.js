'use strict';

/* global asyncStorage, MockNavigation, MockNotif, User, SumoDB */

require('/test/unit/mocks/mock_async_storage.js');
require('/test/unit/mocks/mock_sumo_db.js');
require('/test/unit/mocks/mock_notifications.js');
require('/test/unit/mocks/mock_navigation.js');

require('/js/libs/lodash.custom.min.js');

require('/js/user.js');

var mocksFor = new MocksHelper([
  'asyncStorage',
  'Notif',
  'SumoDB'
]).init();

suite('User', function() {
  this.timeout(500);

  mocksFor.attachTestHelpers();

  suite('authenticate_user', function() {
    setup(function() {
      this.sinon.stub(asyncStorage, 'setItem').returns(Promise.resolve());

      this.sinon.stub(MockNotif, 'ensure_endpoint');
      this.sinon.stub(MockNotif, 'clear_endpoint').returns(Promise.resolve());
      this.sinon.spy(MockNavigation, 'everyone_should_refresh');
    });

    suite('Good credentials', function() {

      const FAKE_TOKEN = '12345';
      const FAKE_USER = {};

      setup(function(done) {
        window.parent.Notif = MockNotif;
        window.parent.Navigation = MockNavigation;

        this.sinon.stub(SumoDB, 'get_token')
          .returns(Promise.resolve(FAKE_TOKEN));
        this.sinon.stub(SumoDB, 'get_user').returns(Promise.resolve(FAKE_USER));
        User.authenticate_user().then(() => done(), done);
      });

      test('synced the user', function(done) {
        User.authenticate_user().then((user) => {
          assert.isTrue(user.last_sync > 0);
        }).then(done, done);
      });

      test('every frame should refresh next time they are viewed', function() {
        sinon.assert.called(MockNavigation.everyone_should_refresh);
      });

      test('sets user infos in local storage', function() {
        sinon.assert.calledWith(asyncStorage.setItem, 'user_credentials');
        sinon.assert.calledWith(asyncStorage.setItem, 'user');
      });

      test('clears old notification endpoints', function() {
        sinon.assert.called(MockNotif.clear_endpoint);
      });

      test('gets a new notification endpoint after clearing old ones',
      function(done) {
        MockNotif.ensure_endpoint.reset();
        MockNotif.clear_endpoint.restore();
        var stub_promise = new Promise((resolve, reject) => {
          setTimeout(function() {
            sinon.assert.notCalled(MockNotif.ensure_endpoint);
            resolve();
          });
        });
        this.sinon.stub(MockNotif, 'clear_endpoint').returns(stub_promise);

        var authenticate_promise = User.authenticate_user().then(() => {
          sinon.assert.calledOnce(MockNotif.ensure_endpoint);
        });
        Promise.all([stub_promise, authenticate_promise])
        .then(() => done(), done);
      });

      test('checks that we mark the account as helper', function() {
        // FIXME implement me!
      });
    });

    suite('Bad credentials', function() {
      setup(function(done) {
        this.sinon.stub(SumoDB, 'get_token').returns(Promise.reject());
        User.authenticate_user().catch(done);
      });

      test('does not store user infos in local storage', function () {
        sinon.assert.notCalled(asyncStorage.setItem);
      });

      test('does not clear old endpoints', function() {
        sinon.assert.notCalled(MockNotif.clear_endpoint);
      });

      test('does not get a new endpoint for notifications', function() {
        sinon.assert.notCalled(MockNotif.ensure_endpoint);
      });
    });
  });

  suite('register', function() {
    const FAKE_USERNAME = 'fake_username';
    const FAKE_PASSWORD = 'fake_password';
    const FAKE_EMAIL = 'fake_email';

    setup(function() {
      this.sinon.stub(SumoDB, 'get_token')
        .returns(Promise.resolve('fake_token'));
      this.sinon.stub(MockNotif, 'clear_endpoint').returns(Promise.resolve());
      this.sinon.stub(asyncStorage, 'setItem').returns(Promise.resolve());
      this.sinon.stub(SumoDB, 'get_user').returns(Promise.resolve({}));
    });

    test('resolves when registration successful', function(done) {
      this.sinon.stub(SumoDB, 'register_user').returns(Promise.resolve());
      User.register(FAKE_USERNAME, FAKE_PASSWORD, FAKE_EMAIL).then(function() {
        sinon.assert.calledWith(SumoDB.register_user,
          FAKE_USERNAME, FAKE_PASSWORD, FAKE_EMAIL);
      }).then(done, done);
    });

    test('rejects when registration unsuccessful', function(done) {
      this.sinon.stub(SumoDB, 'register_user').returns(Promise.reject());
      User.register(FAKE_USERNAME, FAKE_PASSWORD, FAKE_EMAIL).catch(function() {
        sinon.assert.calledWith(SumoDB.register_user,
          FAKE_USERNAME, FAKE_PASSWORD, FAKE_EMAIL);
      }).then(done, done);
    });
  });
});
