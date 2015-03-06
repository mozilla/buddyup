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

  suite('receives notifications', function() {
    const ANSWERED_NOTIF = {
      id: 26,
      actor: {display_name: 'Spongebob'},
      target: {id: 12345},
      'verb': 'answered'
    };
    const RESOLVED_NOTIF = {
      id: 27,
      actor: {display_name: 'Spongebob'},
      target: {id: 12346},
      'verb': 'marked as a solution'
    };
    const UNKNOWN_NOTIF = {
      id: 28,
      'verb': 'unknown action'
    };

    const FAKE_QUESTION = {
      title: 'fake_title'
    };

    const FAKE_APP = {
      installOrigin: 'installOrigin/',
      manifest: {
        icons: {
          '32': '32.png'
        }
      }
    };

    setup(function(done) {
      this.sinon.spy(navigator, 'mozSetMessageHandler').withArgs('push');
      this.sinon.stub(navigator.mozApps, 'getSelf', function() {
        var getSelf_request = {
        };
        setTimeout(() => {
          getSelf_request.onsuccess({target: {result: FAKE_APP}});
        });
        return getSelf_request;
      });
      this.sinon.stub(window, 'Notification').returns({
        addEventListener: () => {}
      });
      this.sinon.stub(SumoDB, 'get_unread_notifications')
        .returns(Promise.resolve([
          ANSWERED_NOTIF,
          UNKNOWN_NOTIF,
          RESOLVED_NOTIF
      ]));
      this.sinon.stub(SumoDB, 'get_question')
        .returns(Promise.resolve(FAKE_QUESTION));
      this.sinon.spy(SumoDB, 'mark_notification_as_read');
      Notif.init();
      var push_handler_spy = navigator.mozSetMessageHandler.withArgs('push');
      var push_handler = push_handler_spy.firstCall.args[1];
      push_handler().then(() => done());
    });

    test('listens to push system messages', function() {
      var push_handler_spy = navigator.mozSetMessageHandler.withArgs('push');
      sinon.assert.calledOnce(push_handler_spy);
    });

    test('displays answers notifications', function() {
      sinon.assert.calledWithNew(window.Notification);
      sinon.assert.calledWithMatch(window.Notification,
        ANSWERED_NOTIF.actor.display_name + ' has commented on a question',
        {
          body: FAKE_QUESTION.title,
          icon: FAKE_APP.installOrigin + FAKE_APP.manifest.icons[32] +
            '?question_id=' + ANSWERED_NOTIF.target.id,
          tag: 'question-' + ANSWERED_NOTIF.target.id
        }
      );
    });

    test('displays resolved notifications', function() {
      sinon.assert.calledWithNew(window.Notification);
      sinon.assert.calledWithMatch(window.Notification,
        RESOLVED_NOTIF.actor.display_name + ' chose your answer',
        {
          body: FAKE_QUESTION.title,
          icon: FAKE_APP.installOrigin + FAKE_APP.manifest.icons[32] +
            '?question_id=' + RESOLVED_NOTIF.target.id,
          tag: 'resolved-' + RESOLVED_NOTIF.target.id
        }
      );
    });

    test('marked known notifications as read', function() {
      sinon.assert.calledTwice(SumoDB.mark_notification_as_read);
      sinon.assert.calledWith(SumoDB.mark_notification_as_read,
        ANSWERED_NOTIF.id);
      sinon.assert.calledWith(SumoDB.mark_notification_as_read,
        RESOLVED_NOTIF.id);
    });
  });

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
