'use strict';

/* global SumoDB, nunjucks, Utils */

(function(exports) {
  /**
   * Shows a list of questions for the current user.
   * @params {object} container - The container for the list.
   */
  function show_questions(container) {
    SumoDB.get_my_questions().then(function(results) {

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
    });
  }

  var QuestionsController = {
    init: function() {
      nunjucks.configure({ autoescape: true });

      Utils.toggle_spinner();

      var myQuestions = document.querySelector('#myquestions');
      show_questions(myQuestions);
    }
  };

  exports.QuestionsController = QuestionsController;
  QuestionsController.init();
})(window);
