'use strict';

/*exported MockSumoDB */

var MockSumoDB = {
  get_new_answers: function(realtime_id) {},
  get_answers_for_question: function(question_id) {},
  get_question: function(question_id) {},
  get_token: function(username, password) {},
  get_unread_notifications: function() {},
  get_user: function(username) {},
  mark_notification_as_read: function(notification_id) {},
  register_realtime_endpoint: function(question_id, endpoint_url) {},
  register_push_endpoint: function(url) {},
  register_user: function(username, password, email) {},
};
