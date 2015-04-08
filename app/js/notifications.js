'use strict';

/* global asyncStorage, Navigation, Notification, SumoDB, Utils */

(function(exports) {
var ENDPOINT_ID_KEY = 'endpoint';
var REALTIME_PREFIX = 'realtime-';

function display_notification(title, body, icon_info, tag) {
  // FIXME We need support for 1.1 notifications
  var defer = Utils.defer();

  navigator.mozApps.getSelf().onsuccess = function (evt) {
    defer.resolve(evt.target.result);
  };

  return defer.promise.then(function(app) {
    var icon_base = app.installOrigin + app.manifest.icons['32'];

    var notif = new Notification(title, {
      body: body,
      icon: icon_base + icon_info,
      tag: tag
    });

    notif.addEventListener('error', function(errorMsg) {
      console.log('something went wrong');
      console.log(errorMsg);
    });

    notif.addEventListener('click', notification_clicked);
  });
}

function push_handler(evt) {
  return asyncStorage.getItem(ENDPOINT_ID_KEY).then(function(endpoint) {
    if (evt.pushEndpoint == endpoint) {
      return push_notification();
    } else {
      return push_realtime();
    }
  });
}

function push_notification() {
  return SumoDB.get_unread_notifications().then(function(notifications) {
    var promises = notifications.map(function(notification) {
      var title;
      var icon_info;
      var tag;
      var actor;

      switch(notification.verb) {
        case 'answered':
          var QuestionC = window.Navigation.current_view.QuestionController;
          var question_displayed = !document.hidden &&
            QuestionC &&
            QuestionC.question_id == notification.target.id;
          // FIXME Bug 1139899 - We should still mark them as read
          if (!question_displayed) {
            actor = notification.actor;
            title = actor.display_name || actor.username;
            title += ' has commented on a question';
            icon_info = '?question_id=' + notification.target.id;
            tag = 'question-' + notification.target.id;
          }
        break;

        case 'marked as a solution':
          actor = notification.actor;
          title = actor.display_name || actor.username;
          title += ' chose your answer';
          icon_info = '?question_id=' + notification.target.id;
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
        return display_notification(title, question.title, icon_info, tag);
      }).then(function() {
        return notification.id;
      }).then(SumoDB.mark_notification_as_read);
    });

    return Promise.all(promises);
  });
}

function push_realtime() {
  var current_view = window.Navigation.current_view;
  if (current_view.QuestionController) {
    current_view.QuestionController.display_new_answers();
  }
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

  listen_to_realtime: function(question_id) {
    return asyncStorage.getItem(REALTIME_PREFIX + question_id)
    .then(function(realtime_endpoint) {
      if (realtime_endpoint) {
        // We already have an endpoint for this, no need to get a new one
        return Promise.reject();
      }
    }).then(function() {
      var defer = Utils.defer();
      var req = navigator.push.register();
      req.onsuccess = function() {
        defer.resolve(req.result);
      };

      return defer.promise.then(function(endpoint_url) {
        return SumoDB.register_realtime_endpoint(question_id, endpoint_url);
      });
    }).then(function(foo) {
      return asyncStorage.setItem(REALTIME_PREFIX + question_id, foo.id);
    });
  },

  get_realtime_id: function(question_id) {
    return asyncStorage.getItem(REALTIME_PREFIX + question_id);
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
