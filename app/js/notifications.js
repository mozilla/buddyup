'use strict';

/* global asyncStorage, Navigation, Notification, SumoDB, Utils */

(function(exports) {
var ENDPOINT_ID_KEY = 'endpoint';

function display_notification(title, body, icon, tag) {
  // FIXME We need support for 1.1 notifications
  var notif = new Notification(title, {
    body: body,
    icon: icon,
    tag: tag
  });

  notif.addEventListener('error', function(errorMsg) {
    console.log('something went wrong');
    console.log(errorMsg);
  });

  notif.addEventListener('click', notification_clicked);
}

function push_handler(evt) {
  return SumoDB.get_unread_notifications().then(function(notifications) {
    var promises = notifications.map(function(notification) {
      var title;
      var icon;
      var tag;

      switch(notification.verb) {
        case 'answered':
          title = notification.actor.display_name;
          title += ' has commented on a question';
          icon = '?question_id=' + notification.target.id;
          tag = 'question-' + notification.target.id;
        break;

        case 'marked as a solution':
          title = notification.actor.display_name + ' chose your answer';
          icon = '?question_id=' + notification.target.id;
          tag = 'resolved-' + notification.target.id;
        break;

        default:
          console.error('unknown notification type: ', notification.verb);
        break;
        }

      if (!title) {
        return notification.id;
      }

      return SumoDB.get_question(notification.target.id)
        .then(function(question) {
          display_notification(title, question.title, icon, tag);
          return notification.id;
        })
        .then(SumoDB.mark_notification_as_read);
    });

    return Promise.all(promises);
  });
}

function notification_clicked(evt) {
  navigator.mozApps.getSelf().onsuccess = function(appEvt) {
    var iconURL = evt.imageURL || // from system message
      evt.target.icon; // from click event
    var location = document.createElement('a');
    location.href = iconURL;
    var parameters = Utils.get_url_parameters(location);

    Navigation.go_to_view('question.html?id=' + parameters.question_id);

    var app = appEvt.target.result;
    app.launch();

    delete_notification(evt);
  };
}

function delete_notification(evt) {
  var notifications_promise;
  if (evt.target) {
    // from click event
    notifications_promise = Promise.resolve([evt.target]);
  } else {
    // from system message
    notifications_promise = Notification.get({ tag: evt.tag });
  }

  notifications_promise.then(function(notifications) {
    for (var i = 0; i < notifications.length; i++) {
      notifications[i].close();
    }
  });
}

var ensure_endpoint_in_progress = false;
var Notif = {
  ensure_endpoint: function() {
    if (!navigator.push) {
      // Do nothing when push notifications are not supported
      console.log('no support for push notifications');
      return Promise.resolve();
    }

    if (ensure_endpoint_in_progress) {
      return Promise.resolve();
    }
    ensure_endpoint_in_progress = true;

    function ensure_endpoint_done() {
      ensure_endpoint_in_progress = false;
    }

    return asyncStorage.getItem(ENDPOINT_ID_KEY).then(function(endpoint) {
      if (endpoint) {
        return Promise.resolve();
      }

      var defer = Utils.defer();
      var req = navigator.push.register();
      req.onsuccess = function() {
        defer.resolve(req.result);
      };
      req.onerror = function() {
        defer.reject();
      };

      return defer.promise.then(function(endpoint_url) {
        var set_promise = asyncStorage.setItem(ENDPOINT_ID_KEY, endpoint_url);
        return Promise.all([endpoint_url, set_promise]);
      }).then(function([endpoint_url, set_promise]) {
        return SumoDB.register_push_endpoint(endpoint_url);
      }).catch(function() {
        return asyncStorage.removeItem(ENDPOINT_ID_KEY);
      });
    }).then(ensure_endpoint_done, ensure_endpoint_done);
  },

  clear_endpoint: function() {
    return asyncStorage.removeItem(ENDPOINT_ID_KEY);
  },

  init: function() {
    if (!navigator.mozSetMessageHandler) {
      // "Silence" errors in dev environments
      navigator.mozSetMessageHandler = function() {};
      console.log('system messages are not supported');
    }

    navigator.mozSetMessageHandler('push', push_handler);
    navigator.mozSetMessageHandler('push-register', function(evt) {
      // TODO Implement in bug 1132526
    });

    navigator.mozSetMessageHandler('notification', notification_clicked);
  }
};

exports.Notif = Notif;
Notif.init();
})(window);
