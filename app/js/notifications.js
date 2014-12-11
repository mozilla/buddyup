'use strict';

/* global Notification, Utils */

(function(exports) {

/* This is to send a fake notification */
window.addEventListener('message', function(evt) {
  var wake_up_date = new Date();
  wake_up_date.setSeconds(wake_up_date.getSeconds() + 5);
  navigator.mozAlarms.add(wake_up_date, 'honorTimezone', evt.data);
});

navigator.mozSetMessageHandler('alarm', function(mozAlarm) {
  // FIXME We need support for 1.1 notifications
  var display_name = mozAlarm.data.comment.creator.display_name ||
    mozAlarm.data.comment.creator.username;
  var title = display_name + ' has commented on a question:';
  var body = mozAlarm.data.comment.content;
  var notif = new Notification(title, {
    body: body,
    icon: '?question_id=' + mozAlarm.data.question_id,
    tag: 'q' + mozAlarm.data.question_id
  });

  notif.addEventListener('error', function(errorMsg) {
    console.log('something went wrong');
    console.log(errorMsg);
  });

  notif.addEventListener('click', notification_clicked);
});

navigator.mozSetMessageHandler('notification', notification_clicked);

function notification_clicked(evt) {
  navigator.mozApps.getSelf().onsuccess = function(appEvt) {
    var iconURL = evt.imageURL || // from system message
      evt.target.icon; // from click event
    var location = document.createElement('a');
    location.href = iconURL;
    var parameters = Utils.get_url_parameters(location);

    document.querySelector('iframe').src = 'question.html?id=' +
      parameters.question_id;

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
})(window);
