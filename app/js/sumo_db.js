'use strict';

(function(exports) {
  var API_V1_BASE = 'https://support.allizom.org/api/1/';
  var API_V2_BASE = 'https://support.allizom.org/api/2/';
  var token;

  function get_token() {
    if (token) {
      return Promise.resolve(token);
    }

    var endpoint = API_V1_BASE + 'users/get_token';
    var data = {
      username: 'rik24d',
      password: 'foobarbaz1'
    };
    return request(endpoint, 'POST', data).then(function(response) {
      var json = JSON.parse(response);
      token = json.token;
      return token;
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
    return get_token().then(function(token) {
      return request(url, method, data, {authorization: 'Token ' + token});
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
      request_with_auth(endpoint, 'POST', data).then(function(response) {
        console.log(response);
      }).then();
    }
  };
  exports.SumoDB = SumoDB;
})(window);
