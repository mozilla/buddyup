'use strict';

/* global asyncStorage, Navigation, Notification, SumoDB, Utils */

(function(exports) {
var ENDPOINT_ID_KEY = 'endpoint';

if (!navigator.mozSetMessageHandler) {
  // "Silence" errors in dev environments
  navigator.mozSetMessageHandler = function() {};
  console.log('system messages are not supported');
}

function display_notification(notification, question) {
  // FIXME We need support for 1.1 notifications
  var title = notification.actor.display_name + ' has commented on a question:';
  var body = question.title;
  var notif = new Notification(title, {
    body: body,
    icon: '?question_id=' + notification.target.id,
    tag: 'q' + notification.target.id
  });

  notif.addEventListener('error', function(errorMsg) {
    console.log('something went wrong');
    console.log(errorMsg);
  });

  notif.addEventListener('click', notification_clicked);
}

navigator.mozSetMessageHandler('push', function(evt) {
  SumoDB.get_unread_notifications().then(function(notifications) {
    notifications.forEach(function(notification) {
      SumoDB.get_question(notification.target.id)
      .then(function(question) {
        display_notification(notification, question);
        return notification.id;
      }).then(SumoDB.mark_notification_as_read);
    });
  });
});

navigator.mozSetMessageHandler('push-register', function(evt) {
  // TODO Implement in bug 1132526
});

navigator.mozSetMessageHandler('notification', notification_clicked);

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
  }

};

exports.Notif = Notif;

})(window);

