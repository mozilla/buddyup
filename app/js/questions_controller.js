'use strict';

/* global SumoDB, nunjucks */

(function(exports) {
  /**
   * Shows a list of questions for the current user.
   * @params {object} container - The container for the list.
   */
  function show_questions(container) {
      SumoDB.get_questions().then(function(json) {
          var results;
          var showAll = false;

          if (container.dataset.all) {
              results = json.results;
              showAll = true;
          } else {
              results = json.results.slice(0, 3);
          }

          var html = nunjucks.render('questions.html', {
              results: results,
              all: showAll
          });
          container.innerHTML = html;
      });
  }

  var QuestionsController = {
    init: function() {
      nunjucks.configure({ autoescape: true });

      var myQuestions = document.querySelector('#myquestions');
      show_questions(myQuestions);
    }
  };

  exports.QuestionsController = QuestionsController;
  QuestionsController.init();
})(window);
