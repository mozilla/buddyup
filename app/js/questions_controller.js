'use strict';

/* global UserController, SumoDB, Utils, nunjucks */

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
          var created = results[i].created;
          results[i].created = Utils.time_since(new Date(created), true);
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
        // no questions for the user, render the template passing
        // relevant message to user.
        Utils.toggle_spinner();
        html = nunjucks.render('questions.html', {
          message: 'No questions found'
        });
        container.innerHTML = html;
      }

    });
  }

  var QuestionsController = {
    init: function() {
      nunjucks.configure({ autoescape: true });

      Utils.toggle_spinner();

      var myQuestions = document.querySelector('#myquestions');
      UserController.get_user().then(function(response) {
        if (response) {
          show_questions(response, myQuestions);
        } else {
          UserController.create_user().then(function(response) {
            show_questions(response, myQuestions);
          });
        }
      });
    }
  };

  exports.QuestionsController = QuestionsController;
  QuestionsController.init();
})(window);
