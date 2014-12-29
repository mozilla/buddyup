'use strict';

/* global User */

(function(exports) {
  var API_V2_BASE = 'https://support.allizom.org/api/2/';
  var PRODUCT = 'firefox-os';

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
        var endpoint = API_V2_BASE + 'user/';
        endpoint += credentials.username + '/';
        endpoint += '?format=json'; // TODO bug 1088014

        user_data.username = credentials.username;
        user_data.password = credentials.password;
        return request_with_auth(endpoint, 'PUT', user_data);
      }).then(JSON.parse);
    },

    get_user: function(username) {
      var endpoint = API_V2_BASE + 'user/' + username + '/';
      endpoint += '?format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(JSON.parse);
    },

    update_preference: function(user, setting) {
      var endpoint = API_V2_BASE + 'user/';
      endpoint += user.username + '/';
      endpoint += 'set_setting/'
      endpoint += '?format=json'; // TODO bug 1088014

      return request_with_auth(endpoint, 'POST', setting).then(JSON.parse);
    }
  };
  exports.SumoDB = SumoDB;
})(window);
