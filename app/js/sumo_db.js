'use strict';

/* global _, Settings, User */

(function(exports) {
  var API_V1_BASE = Settings.BASE_SERVER + '/api/1/';
  var API_V2_BASE = Settings.BASE_SERVER + '/api/2/';
  var PRODUCT = 'firefox-os';
  var CATEGORY_PREFIX = 'category:';

  var in_progress_requests = {};
  var sequence_id = 0;
  var last_request;

  function trigger_error() {
    var event = new Event('network-error');
    document.dispatchEvent(event);
  }

  function request(url, method, data, headers) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      last_request = req;
      req.open(method, url);
      if (data) {
        req.setRequestHeader('Content-Type', 'application/json');
      }
      for (var field in headers) {
        req.setRequestHeader(field, headers[field]);
      }

      req.onload = function() {
        if (req.status >= 200 && req.status < 300) {
          resolve(req.responseText);
        } else if (req.status >= 500) {
          trigger_error();
          reject(req.responseText);
        } else {
          reject(req.responseText);
        }
      };

      req.onerror = function() {
        trigger_error();
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

  function remove_tags(tags, question_id) {
    var endpoint = API_V2_BASE + 'question/';
    endpoint += question_id + '/remove_tags/';
    endpoint += '?format=json'; // TODO bug 1088014

    return request_with_auth(endpoint, 'POST',
      {tags: tags});
  }

  function add_tags(tags, question_id) {
    var endpoint = API_V2_BASE + 'question/';
    endpoint += question_id + '/add_tags/';
    endpoint += '?format=json'; // TODO bug 1088014

    return request_with_auth(endpoint, 'POST',
      {tags: tags}).then(JSON.parse);
  }

  var SumoDB = {
    /**
    * Submits a new question to the server.
    * @param {string} text - The question text
    * @param {object} user_meta - Meta data from the user's device
    * @returns response from the server on success
    */
    post_question: function(text, user_meta) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += '?format=json'; // TODO bug 1088014
      var data = {
        title: text,
        product: 'firefox-os',
        content: ' ',
        topic: 'basic-features',
        locale: user_meta.lang
      };
      // we need to create the question before we can set the metadata as we
      // need the questions's id
      return request_with_auth(endpoint, 'POST', data).then(function(response) {
        return JSON.parse(response).id;
      }).then(function(question_id) {
        // question was created successfully, now set the metadata
        var metadata_updates = [];
        var metadata = user_meta.metadata;
        for (var i = 0, l = metadata.length; i < l; i++) {
          metadata_updates.push(
            SumoDB.update_question_metadata(question_id, metadata[i])
          );
        }
        // once the the metadata updates have completed successfully,
        // we will have to fetch the question again so we have access
        // to the metadata that we just set.
        return Promise.all(metadata_updates).then(function() {
          return question_id;
        });
      }).then(function(question_id) {
        return SumoDB.get_question(question_id);
      });
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

    take_question: function(question_id) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += question_id + '/take/';
      endpoint += '?format=json'; // TODO bug 1088014

      return request_with_auth(endpoint, 'POST');
    },

    solve_question: function(question_id, answer_id) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += question_id +'/solve/';
      endpoint += '?format=json'; // TODO bug 1088014

      var vote_promise = SumoDB.submit_vote(answer_id);
      var solved_promise = request_with_auth(endpoint, 'POST',
        {answer: answer_id});

      return Promise.all([vote_promise, solved_promise]);
    },

    set_category_for_question: function(category, question_id) {
      var promise = SumoDB.get_question(question_id);
      
      return promise.then(function(question) {
        var category_tags = question.tags.filter(function(tag) {
          return tag.name.startsWith(CATEGORY_PREFIX);
        }).map(function(elem) {
          return elem.name;
        });
        var remove_promise = remove_tags(category_tags, question_id);
        var add_promise = add_tags([CATEGORY_PREFIX + category], question_id);
        return Promise.all([remove_promise, add_promise]);
      });
    },

    /**
     * Get list of questions for the current user
     */
    get_my_questions: function(user) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += '?product=' + PRODUCT;
      endpoint += '&creator=' + user.username;
      endpoint += '&ordering=-updated';
      endpoint += '&format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(JSON.parse);
    },

    /**
     * Get the list of question a user has solved.
     */
    get_solved_questions: function(user) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += '?product=' + PRODUCT;
      endpoint += '&solved_by=' + user.username;
      endpoint += '&ordering=-updated';
      endpoint += '&format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(JSON.parse);
    },

    get_question: function(question_id) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += question_id + '/';
      endpoint += '?format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(function(response) {
        var question = JSON.parse(response);
        var category_tag = question.tags.find(function(element) {
          return element.name.startsWith(CATEGORY_PREFIX);
        });
        if (category_tag) {
          question.category = category_tag.name.substr(CATEGORY_PREFIX.length);
        }
        return question;
      });
    },

    get_question_list: function(url) {
      return request(url, 'GET').then(JSON.parse);
    },

    get_answers_for_question: function(question_id) {
      var endpoint = API_V2_BASE + 'answer/';
      endpoint += '?question=' + question_id;
      endpoint += '&format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(function(response) {
        return JSON.parse(response).results;
      });
    },

    get_unanswered_questions: function(locale) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += '?product=' + PRODUCT;
      endpoint += '&is_solved=0';
      endpoint += '&is_taken=0';
      endpoint += '&locale=' + locale;
      endpoint += '&format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(JSON.parse);
    },

    get_active_questions: function(username) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += '?involved=' + username;
      endpoint += '&format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(JSON.parse);
    },

    get_token: function(username, password) {
      var endpoint = API_V1_BASE + 'users/get_token';
      var data = {
        username: username,
        password: password
      };
      return request(endpoint, 'POST', data).then(function(response) {
        var json = JSON.parse(response);
        return json.token;
      });
    },

    register_user: function(username, password, email) {
      var endpoint = API_V2_BASE + 'user/';
      endpoint += '?format=json'; // TODO bug 1088014
      var data = {
        username: username,
        password: password,
        email: email
      };
      return request(endpoint, 'POST', data).then(JSON.parse);
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
        var settings_updates = [];
        var user = user_data.user;
        user.username = credentials.username;
        user.password = credentials.password;

        // @see bug1113056 - currently we cannot do bulk settings updates.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1113056#c3
        var settings = user_data.settings;
        for (var i = 0, l = settings.length; i < l; i++) {
          settings_updates.push(SumoDB.update_user_settings(user, settings[i]));
        }

        return Promise.all(settings_updates).then(function() {
          var endpoint = API_V2_BASE + 'user/';
          endpoint += user.username + '/';
          endpoint += '?format=json'; // TODO bug 1088014

          return request_with_auth(endpoint, 'PATCH', user).then(JSON.parse);
        });
      });
    },

    get_public_user: function(username, options) {
      var endpoint = API_V2_BASE + 'user/' + username + '/';
      endpoint += '?format=json'; // TODO bug 1088014

      var defaults = {};
      options = _.assign(defaults, options);

      if (options.avatar_size) {
        endpoint += '&avatar_size=' + options.avatar_size;
      }

      return request(endpoint, 'GET').then(JSON.parse);
    },

    get_user: function(username) {
      var endpoint = API_V2_BASE + 'user/' + username + '/';
      endpoint += '?format=json'; // TODO bug 1088014

      // settings is only visible if the user authenticated so, we need
      // to do a request_with_auth here.
      return request_with_auth(endpoint, 'GET').then(JSON.parse);
    },

    /**
     * Submits a new helpful vote for the specified answer.
     * @param {string} answer_id - The answer id to receive the helpful vote.
     */
    submit_vote: function(answer_id) {
      var endpoint = API_V2_BASE + 'answer/';
      endpoint += answer_id + '/';
      endpoint += 'helpful/';
      endpoint += '?format=json'; // TODO bug 1088014

      return request_with_auth(endpoint, 'POST')
        .then(JSON.parse, function(error) {
          return error;
        });
    },

    update_user_settings: function(user, setting) {
      var endpoint = API_V2_BASE + 'user/';
      endpoint += user.username + '/';

      var set_user_setting = endpoint + 'set_setting/';
      set_user_setting += '?format=json'; // TODO bug 1088014

      var delete_user_setting = endpoint + 'delete_setting/';
      delete_user_setting += '?format=json'; // TODO bug 1088014
      return request_with_auth(delete_user_setting, 'POST', setting)
        .then(function(response) {
          return request_with_auth(set_user_setting, 'POST', setting)
            .then(JSON.parse);
        }, function(error) {
          // currently if the settings item did not exist, the server
          // will respond with a 404 error
          // @see https://bugzilla.mozilla.org/show_bug.cgi?id=1074959#c7
          if (error.message === 'NOT FOUND') {
            // settings item did not already exist, safe to set
            return request_with_auth(set_user_setting, 'POST', setting)
            .then(JSON.parse);
          }
        });
    },
    /**
    * Updates the metadata for a specific question id.
    * @param {int} question_id - ID of the question to update
    * @param {object} metadata - The metadata item to update
    */
    update_question_metadata: function(question_id, metadata) {
      var endpoint = API_V2_BASE + 'question/';
      endpoint += question_id + '/';

      var delete_metadata = endpoint + 'delete_metadata/';
      var set_metadata = endpoint + 'set_metadata/';
      delete_metadata += '?format=json'; // TODO bug 1088014
      set_metadata += '?format=json'; // TODO bug 1088014

      return request_with_auth(delete_metadata, 'POST', metadata)
        .then(function(response) {
          return request_with_auth(set_metadata, 'POST', metadata)
            .then(JSON.parse);
      }, function(error) {
        // currently if the metadata item did not exist, the server
        // will respond with a 404 error
        // @see https://bugzilla.mozilla.org/show_bug.cgi?id=1074959#c7
        if (error.message === 'NOT FOUND') {
          // metadata item did not already exist, save to set
          return request_with_auth(set_metadata, 'POST', metadata)
          .then(JSON.parse);
        }
      });
    },

    get_suggestions: function(query, callback) {
      var endpoint = API_V2_BASE + 'search/suggest/';
      endpoint += '?q=' + query;
      endpoint += '&max_questions=3&max_documents=3';
      endpoint += '&locale=' + navigator.language;
      endpoint += '&format=json';

      var current_request = request(endpoint, 'GET');
      var request_sequence = sequence_id++;
      in_progress_requests[request_sequence] = last_request;
      current_request.then(function(response) {
        for (var i in in_progress_requests) {
          if (i < request_sequence) {
            in_progress_requests[i].abort();
            delete in_progress_requests[i];
          }
        }
        if (in_progress_requests[request_sequence]) {
          callback(JSON.parse(response));
          delete in_progress_requests[request_sequence];
        }
      });
      return request(endpoint, 'GET');
    },

    request_password_reset: function(username) {
      var endpoint = API_V2_BASE + 'user/';
      endpoint += username + '/request_password_reset/';

      return request(endpoint, 'GET');
    },

    register_push_endpoint: function(push_url) {
      var endpoint = API_V2_BASE + 'pushnotification/';
      endpoint += '?format=json'; // TODO bug 1088014

      return request_with_auth(endpoint, 'POST', {push_url: push_url});
    },

    get_unread_notifications: function() {
      var endpoint = API_V2_BASE + 'notification/';
      endpoint += '?is_read=0';
      endpoint += '&format=json';

      return request_with_auth(endpoint, 'GET').then(JSON.parse);
    },

    mark_notification_as_read: function(notification_id) {
      var endpoint = API_V2_BASE + 'notification/';
      endpoint += notification_id + '/mark_read/';
      endpoint += '?format=json';

      return request_with_auth(endpoint, 'POST');
    },

    get_top_helpers: function() {
      var endpoint = API_V2_BASE + 'user/weekly-solutions/';
      endpoint += '?format=json'; // TODO bug 1088014

      return request(endpoint, 'GET').then(JSON.parse);
    }
  };
  exports.SumoDB = SumoDB;
})(window);
