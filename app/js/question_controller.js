'use strict';

/* global asyncStorage, SumoDB, Utils, User, nunjucks */

(function(exports) {
  var question_thread;
  var question_id;
  var dialog;
  var user;

  var question_field;

  var question_object;

  /**
   * Handles close button events from a dialog modal.
   */
  function dialog_handler() {
    dialog = document.querySelector('#first_question_help');
    var closeButton = dialog.querySelector('#confirm');

    closeButton.addEventListener('click', function(evt) {
      evt.preventDefault();
      dialog.classList.add('hide');
    });
  }

  /**
  * Adds the thread header that displays, the relative time the question was
  * posted, the device (if already categorised) and the display name of the
  * user who posted the question.
  * @param {object} question - The question JSON object
  */
  function add_thread_header(question) {
    var handset_type;
    var date_posted = Utils.time_since(new Date(question.updated));
    var author = question.creator.display_name || question.creator.username;

    for (var i = 0, l = question.metadata.length; i < l; i++) {
      var current_item = question.metadata[i];
      if (current_item.name === 'handset_type') {
        handset_type = current_item.value;
        break;
      }
    }
    var html = nunjucks.render('thread_header.html', {
      date_posted: date_posted,
      handset_type: handset_type,
      author: author
    });
    question_thread.insertAdjacentHTML('afterbegin', html);
  }

  function submit_comment(evt) {
    evt.preventDefault();
    var comment = question_field.value;

    Utils.toggle_spinner();

    document.getElementById('thread-introduction').classList.add('hide');
    question_thread.classList.remove('hide');

    var fake_comment = nunjucks.render('comment.html',
      {comment: {content: comment}});
    var list = document.getElementById('comment-list');
    var list_item = document.createElement('li');

    list.appendChild(list_item).innerHTML += fake_comment;
    var is_helper = question_object &&
      user.username !== question_object.creator.username;
    if (is_helper) {
      list_item.classList.add('helper-comment');
    }
    list_item.scrollIntoView();

    var submit_promise;
    if (question_id) {
      submit_promise = submit_answer(question_id, comment);
    } else {
      submit_promise = submit_question(comment).then(function(comment) {

        add_thread_header(comment);

        comment.content = comment.title;
        return comment;
      });
    }

    submit_promise.then(function(comment) {

      Utils.toggle_spinner();

      question_field.value = '';

      // Only handle first time help message scenario for questions
      if (comment.answers) {
        asyncStorage.getItem('seen_first_question_help', function(response) {
          // See if the flag exist
          if (!response) {
            // flag does not exist, show the dialog and set the flag
            dialog.classList.remove('hide');
            asyncStorage.setItem('seen_first_question_help', true);
          }
        });
      }

      comment.created = Utils.time_since(new Date(comment.created));
      comment.author = comment.creator.display_name || comment.creator.username;
      list_item.innerHTML = nunjucks.render('comment.html', {
        comment: comment
      });

      window.top.postMessage({question_id: question_id, comment: comment}, '*');
    });
  }

  function submit_question(comment) {
    return SumoDB.post_question(comment, Utils.get_user_meta()).then(function(response) {
      question_id = response.id;
      return response;
    });
  }

  function submit_answer(question_id, comment) {
    return SumoDB.post_answer(question_id, comment).then(function(response) {
      return response;
    });
  }

  function show_question() {

    document.getElementById('thread-introduction').classList.add('hide');

    if (!question_id) {
      Utils.toggle_spinner();
      return;
    }

    question_thread.classList.remove('hide');

    var question_content = [];
    question_content.push(SumoDB.get_question(question_id));

    question_content.push(SumoDB.get_answers_for_question(question_id));

    Promise.all(question_content).then(function([question, answers]) {

      Utils.toggle_spinner();

      question_object = question;

      question.content = question.title;
      answers.push(question);
      answers.reverse();

      for (var i = 0, l = answers.length; i < l; i++) {
        var created = answers[i].created;
        answers[i].author = answers[i].creator.display_name ||
          answers[i].creator.username;
        answers[i].created = Utils.time_since(new Date(created));
      }

      add_thread_header(question);
      var html = nunjucks.render('thread.html', {
        author: question.creator.display_name || question.creator.username,
        user: user,
        results: answers
      });
      var list = document.getElementById('comment-list');
      list.insertAdjacentHTML('beforeend', html);
    });
  }

  var QuestionController = {
    init: function() {
      question_field = document.getElementById('question_field');

      var form = document.getElementById('question_form');
      form.addEventListener('submit', submit_comment);

      // we will need the user details whether the user is posting a question
      // or just viewing a question so, load the user during init
      User.get_user().then(function(response) {
        user = response;
      });

      question_thread = document.getElementById('question-thread');

      // handle dialog close events
      dialog_handler();

      var question_view = location.search ? true : false;
      if (question_view) {
        var params = Utils.get_url_parameters(location);
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
