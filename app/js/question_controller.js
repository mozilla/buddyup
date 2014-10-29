'use strict';

/* global SumoDB, Utils, nunjucks */

(function(exports) {
  var question_id;

  function submit_comment(evt) {
    evt.preventDefault();
    var comment = document.getElementById('question_field').value;

    Utils.show_spinner();

    if (question_id) {
      submit_answer(question_id, comment);
    } else {
      submit_question(comment);
    }
  }

  function parseQueryString(queryString) {
      var params = {};

      var queries = queryString.split('&');

      // Convert the array of strings into an object
      for (var i = 0, l = queries.length; i < l; i++) {
          var [key, value] = queries[i].split('=');
          params[key] = value;
      }

      return params;
  }

  function submit_question(comment) {
    SumoDB.post_question(comment).then(function(response) {
      question_id = response.id;
      SumoDB.get_question(question_id).then(function(response) {
        Utils.remove_spinner();
        console.log(response);
      });
    });
  }

  function submit_answer(question_id, comment) {
    SumoDB.post_answer(question_id, comment).then(function(response) {
      Utils.remove_spinner();
    });
  }

  function show_question() {
    if (!question_id) {
      return;
    }

    document.getElementById('thread-introduction').classList.add('hide');

    var promises = [];
    promises.push(SumoDB.get_question(question_id));

    promises.push(SumoDB.get_answers_for_question(question_id).then(function(json) {
      return json.results;
    }));

    Promise.all(promises).then(function([question, answers]) {
      question.content = question.title;
      answers.push(question);
      answers.reverse();
      var html = nunjucks.render('comment.html', {
        results: answers
      });
      document.getElementById('question-thread').innerHTML = html;
    });
  }

  var QuestionController = {
    init: function() {
      var form = document.getElementById('question_form');
      form.addEventListener('submit', submit_comment);

      if (location.search) {
        var params = parseQueryString(location.search.substring(1));
        if (params.id) {
          question_id = params.id;
          show_question();
        }
      }
    }
  };
  exports.QuestionController = QuestionController;
  QuestionController.init();
})(window);
