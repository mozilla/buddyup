'use strict';

/* global SumoDB */

(function(exports) {
  function submit_question(evt) {
    evt.preventDefault();
    var question_field = document.getElementById('question_field');
    SumoDB.post_question(question_field.value);
  }

  var QuestionController = {
    init: function() {
      var form = document.getElementById('question_form');
      form.addEventListener('submit', submit_question);
    }
  };
  exports.QuestionController = QuestionController;
  QuestionController.init();
})(window);
