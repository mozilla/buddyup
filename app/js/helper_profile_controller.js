'use strict';

/* global SumoDB, Utils, nunjucks  */

(function(exports) {
  var MSG_NO_QUESTIONS = 'No questions found';
  var PROFILE_DETAILS_TMPL = 'helper_profile.html';
  var QUESTION_LIST_TMPL = 'question_list_day.html';

  var username;
  var headline;
  var profile_details_container;
  var questions_container;

  function load_profile() {
    var promise = SumoDB.get_public_user(username, {avatar_size: 96});

    promise.then(function(user) {
      headline.innerHTML = user.display_name;

      var profile_html = nunjucks.render(PROFILE_DETAILS_TMPL, {
        user: user
      });

      profile_details_container.innerHTML = profile_html;

      SumoDB.get_solved_questions(user).then(function(response) {
        var results = response.results;
        var html;

        if (results.length) {
          for (var i = 0, l = results.length; i < l; i++) {
            var updated = results[i].updated;
            results[i].updated_day = updated.split('T')[0];
            results[i].updated = Utils.time_since(new Date(updated));
          }

          html = nunjucks.render(QUESTION_LIST_TMPL, {
            next: response.next,
            results: results
          });
        } else {
          html = nunjucks.render(QUESTION_LIST_TMPL, {
            message: MSG_NO_QUESTIONS
          });
        }
        questions_container.insertAdjacentHTML('beforeend', html);

        Utils.toggle_spinner();
      });
    });
  }

  var HelperProfileController = {
    init: function() {
      headline = document.getElementById('headline');
      profile_details_container = document.getElementById(
        'profile-details');
      questions_container = document.getElementById('questions');

      var params = Utils.get_url_parameters(location);
      if (params.username) {
        Utils.toggle_spinner();

        username = params.username;
        load_profile();
      }
    }
  };

  exports.HelperProfileController = HelperProfileController;
  HelperProfileController.init();
})(window);
