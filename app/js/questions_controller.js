'use strict';

/* global SumoDB, nunjucks, Utils */

(function(exports) {
  /**
   * Shows a list of questions for the current user.
   * @params {object} user - The user details
   * @params {object} container - The container for the list.
   */
  function show_questions(user, container) {

    var html;
    var promise = SumoDB.get_my_questions;
    var params = Utils.get_url_parameters();

    if ('helper' === params.role) {
      promise = SumoDB.get_unanswered_questions;
    }

    promise(user).then(function(results) {

      if (results.length) {
        Utils.toggle_spinner();

        for (var i = 0, l = results.length; i < l; i++) {
          var updated = results[i].updated;
          results[i].updated = Utils.time_since(new Date(updated), true);
        }

        var showAll = false;
        if (container.dataset.all) {
          showAll = true;
        } else {
          results = results.slice(0, 3);
        }

        html = nunjucks.render('questions.html', {
          results: results,
          all: showAll
        });
        container.innerHTML = html;
      } else {
        // no questions for the user, just render the template with no data.
        Utils.toggle_spinner();
        html = nunjucks.render('questions.html', {});
        container.innerHTML = html;
      }

    });
  }

  var QuestionsController = {
    init: function() {
      nunjucks.configure({ autoescape: true });

      Utils.toggle_spinner();

      var myQuestions = document.querySelector('#myquestions');
      Utils.get_create_user().then(function(response) {
        if (response) {
          show_questions(response, myQuestions);
        } else {
          // no user exists, just render the template with no data.
          Utils.toggle_spinner();
          var html = nunjucks.render('questions.html', {});
          myQuestions.innerHTML = html;
        }
      });
    }
  };

  exports.QuestionsController = QuestionsController;
  QuestionsController.init();
})(window);
