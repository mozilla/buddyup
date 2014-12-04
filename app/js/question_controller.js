'use strict';

/* global UserController, SumoDB, Utils, nunjucks */

(function(exports) {
  var question_id;

  function submit_comment(evt) {
    evt.preventDefault();
    var comment = document.getElementById('question_field').value;

    Utils.toggle_spinner();

    document.getElementById('thread-introduction').classList.add('hide');
    document.getElementById('question-thread').classList.remove('hide');

    var fake_comment = nunjucks.render('comment.html',
      {comment: {content: comment}});
    var list = document.getElementById('comment-list');
    var list_item = document.createElement('li');

    list.appendChild(list_item).innerHTML += fake_comment;
    list_item.scrollIntoView();

    var submit_promise;
    if (question_id) {
      submit_promise = submit_answer(question_id, comment);
    } else {
      submit_promise = submit_question(comment).then(function(comment) {
        comment.content = comment.title;
        return comment;
      });
    }

    submit_promise.then(function(comment) {

      SumoDB.get_questions_count().then(function(questions_count) {

        Utils.toggle_spinner();

        console.log(questions_count);

        if (questions_count === 1) {
          // This is the user's first question, show the confirmation dialog.
          document.querySelector('[role="dialog"]').classList.remove('hide');
        }

        comment.created = Utils.time_since(new Date(comment.created));
        list_item.innerHTML = nunjucks.render('comment.html',
          {comment: comment});
      });
    });
  }

  function submit_question(comment) {
    return SumoDB.post_question(comment).then(function(response) {
      question_id = response.id;
      return response;
    });
  }

  function submit_answer(question_id, comment) {
    return SumoDB.post_answer(question_id, comment).then(function(response) {
      return response;
    });
  }

  /**
   * Adds an event listener to the new comment notify checkbox and updates
   * the current user's preference on change events.
   */
  function pref_change_listener() {
    var new_comments_notification = document.querySelector('#new_comments_notification');

    // only add event listener if the element exists
    if (new_comments_notification) {
      new_comments_notification.addEventListener('change', function() {
        UserController.set_preference('new_comment_notify', this.checked);
      });
    }
  }

  function show_question() {
    if (!question_id) {
      Utils.toggle_spinner();
      return;
    }

    document.getElementById('thread-introduction').classList.add('hide');
    document.getElementById('question-thread').classList.remove('hide');

    var question_content = [];
    question_content.push(SumoDB.get_question(question_id));

    question_content.push(SumoDB.get_answers_for_question(question_id));

    Promise.all(question_content).then(function([question, answers]) {

      Utils.toggle_spinner();

      question.content = question.title;
      answers.push(question);
      answers.reverse();

      for (var i = 0, l = answers.length; i < l; i++) {
        var created = answers[i].created;
        answers[i].created = Utils.time_since(new Date(created));
      }

      var question_thread = document.getElementById('question-thread');
      var html = nunjucks.render('thread.html', {
        new_comment_notify: window.user.new_comment_notify,
        results: answers
      });
      question_thread.insertAdjacentHTML('beforeend', html);
      // listen for clicks on new comment notify checkbox
      pref_change_listener();
    });
  }

  var QuestionController = {
    init: function() {
      var form = document.getElementById('question_form');
      form.addEventListener('submit', submit_comment);

      UserController.init().then(function(response) {
        exports.user = response;
      });

      if (location.search) {
        var params = Utils.get_url_parameters(location.search.substring(1));
        if (params.id) {

          Utils.toggle_spinner();

          question_id = params.id;
          show_question();
        }
      }
    }
  };
  exports.QuestionController = QuestionController;
  QuestionController.init();

})(window);
