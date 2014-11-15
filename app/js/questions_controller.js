'use strict';

/* global SumoDB, nunjucks, localforage, Utils */

(function(exports) {
  /**
   * Shows a list of questions for the current user.
   * @params {object} container - The container for the list.
   */
  function show_questions(container) {

    var promise = SumoDB.get_my_questions;
    var params = Utils.get_url_parameters();

    if ('helper' === params.role) {
      promise = SumoDB.get_unanswered_questions;
    }

    promise().then(function(results) {

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

        var html = nunjucks.render('questions.html', {
          results: results,
          all: showAll
        });
        container.innerHTML = html;
      } else {
        //tmp
        console.log('No questions found.');
      }

    });
  }

  var QuestionsController = {
    init: function() {
      nunjucks.configure({ autoescape: true });

      Utils.toggle_spinner();

      var myQuestions = document.querySelector('#myquestions');
      Utils.user_exists().then(function(response) {
        if (response) {
          console.log(response);
          show_questions(myQuestions);
        } else {
          // tmp
          console.log('No user exists');
        }
      });
    }
  };

  exports.QuestionsController = QuestionsController;
  QuestionsController.init();
})(window);
