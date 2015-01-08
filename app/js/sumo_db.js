'use strict';

/* global User */

(function(exports) {
  var API_V1_BASE = 'https://support.allizom.org/api/1/';
  var API_V2_BASE = 'https://support.allizom.org/api/2/';
  var PRODUCT = 'firefox-os';

  function get_token() {
    var endpoint = API_V1_BASE + 'users/get_token';
    var data = {
      username: window.user.username,
      password: window.user.password
    };
    return request(endpoint, 'POST', data).then(function(response) {
      var json = JSON.parse(response);
      return json.token;
    });
  }

  function request(url, method, data, headers) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open(method, url);
      req.setRequestHeader('Content-Type', 'application/json');
      for (var field in headers) {
        req.setRequestHeader(field, headers[field]);
      }

      req.onload = function() {
        if (req.status >= 200 && req.status < 300) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(Error('Network Error'));
      };

      req.send(JSON.stringify(data));
    });
  }

  function request_with_auth(url, method, data) {
    return User.get_credentials().then(function(credentials) {
      return request(url, method, data, {
        authorization: 'Token ' + credentials.token
      });
    });
  }

  var SumoDB = {
    post_question: function(text) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += '?format=json'; // TODO bug 1088014
      var data = {
        title: text,
        product: 'firefox-os',
        content: ' ',
        topic: 'basic-features'
      };
      return request_with_auth(endpoint, 'POST', data)
        .then(function(response) {
          return JSON.parse(response);
        }
      );
    },

    post_answer: function(question_id, text) {
      var endpoint = API_V2_BASE + 'answer/';
      endpoint += '?format=json'; // TODO bug 1088014
      var data = {
        question: question_id,
        content: text
      };
      return request_with_auth(endpoint, 'POST', data)
      .then(function(response) {
          return JSON.parse(response);
        }
      );
    },
    /**
     * Get list of questions for the current user
     */
    get_my_questions: function(user) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += '?product=' + PRODUCT;
      endpoint += '&creator=' + user.username;
      endpoint += '&locale=' + user.locale;
      endpoint += '&ordering=-updated';
      endpoint += '&format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(function(response) {
        return JSON.parse(response).results;
      });
    },

    get_question: function(question_id) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += question_id + '/';
      endpoint += '?format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(function(response) {
        return JSON.parse(response);
      });
    },

    get_answers_for_question: function(question_id) {
      var endpoint = API_V2_BASE + 'answer/';
      endpoint += '?question=' + question_id;
      endpoint += '&format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(function(response) {
        return JSON.parse(response).results;
      });
    },

    get_unanswered_questions: function() {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += '?product=' + PRODUCT;
      endpoint += '&is_solved=0';
      endpoint += '&format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(function(response) {
        return JSON.parse(response).results;
      });
    },

    create_user: function() {
      var endpoint = API_V2_BASE + 'user/generate';
      endpoint += '?format=json'; // TODO bug 1088014

      return request(endpoint, 'POST').then(function(response) {
        return JSON.parse(response);
      });
    },

    update_user: function(user_data) {
      return User.get_credentials().then(function(credentials) {
        var preference_updates = [];
        var user = user_data.user;
        user.username = credentials.username;
        user.password = credentials.password;

        // @see bug1113056 - currently we cannot do bulk settings updates.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1113056#c3
        var settings = user_data.settings;
        for (var i = 0, l = settings.length; i < l; i++) {
          preference_updates.push(SumoDB.update_preference(user, settings[i]));
        }

        return Promise.all(preference_updates).then(function() {
          var endpoint = API_V2_BASE + 'user/';
          endpoint += user.username + '/';
          endpoint += '?format=json'; // TODO bug 1088014

          return request_with_auth(endpoint, 'PATCH', user).then(JSON.parse);
        });
      });
    },

    get_user: function(username) {
      var endpoint = API_V2_BASE + 'user/' + username + '/';
      endpoint += '?format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(JSON.parse);
    }
  };
  exports.SumoDB = SumoDB;
})(window);
