'use strict';

/* global _, asyncStorage, SumoDB, Utils, User, nunjucks */

(function(exports) {
  /**
   * If you add a new category, the appropriate tag will need to added on SUMO
   * to ensure end users do not run into issues with not being authorized to add
   * new tags.
   */
  var CATEGORIES = {
    '': 'Choose a category',
    'email': 'Email/Calendar',
    'browser':'Browser/Download',
    'calling':'Dialer/Contacts',
    'clock':'Clock/Alarm',
    'camera': 'Camera/Gallery/Video',
    'audio': 'Audio/Music/FMRadio',
    'performance': 'Performance',
    'radios': 'Cellular Data/WiFi/Bluetooth',
    'sms': 'SMS/MMS',
    'storage': 'Storage/SD card',
    'geolocation': 'Maps/GPS',
    'keyboard': 'Keyboard',
    'system-updates': 'System Updates',
    'language': 'Language',
    'marketplace': 'Marketplace/Apps Install',
    'other': 'Other'
  };

  var question_thread;
  var question_form;
  var suggestions;
  var thread_introduction;
  var question_id;

  var question_field;

  var question_object;
  var solution_id;

  function handle_event(evt) {
    var elem = evt.target;

    var answer_id = null;
    var node = elem.parentElement;
    while (node) {
      if (node.dataset.id) {
        answer_id = node.dataset.id;
        node = null;
      } else {
        node = node.parentElement;
      }
    }

    if (elem.classList.contains('js-vote')) {
      return handle_helpful_votes(elem, answer_id);
    }
    if (elem.classList.contains('js-solve')) {
      return handle_solving(elem, answer_id);
    }
  }

  function handle_autoresize(evt) {
    var elem = evt.target;
    if (elem.value.length) {
      elem.style.height = 'auto';
      elem.style.height = elem.scrollHeight + 'px';
    } else {
      elem.style.height = '';
    }
  }

  function handle_helpful_votes(elem, answer_id) {
    SumoDB.submit_vote(answer_id).then(function(response) {
      elem.classList.add('active');

      if (response.num_helpful_votes) {
        elem.textContent = response.num_helpful_votes;
      } else if (response.message === 'CONFLICT') {
        // Do nothing, user has already voted
      }
    });
  }

  function handle_solving(elem, answer_id) {
    var confirm_solve = document.getElementById('confirm_solve');
    confirm_solve.classList.remove('hide');

    confirm_solve.addEventListener('click', function(evt) {
      if (!evt.target.classList.contains('recommend')) {
        return;
      }
      SumoDB.solve_question(question_id, answer_id).then(function(response) {
        var p = document.createElement('p');
        p.textContent = 'Solution ✓';
        p.classList.add('is_solution');
        elem.parentNode.replaceChild(p, elem);
        close_question();
      });
    });

  }

  function close_question() {
    question_form.parentElement.classList.add('hide');
  }

  /**
   * Handles close button events from a dialog modal.
   */
  function close_dialog_handler() {
    var dialogs = document.querySelectorAll('form[data-type="confirm"]');
    function close_dialog(evt) {
      evt.preventDefault();
      evt.target.classList.add('hide');
    }
    for (var dialog of dialogs) {
      dialog.addEventListener('submit', close_dialog);
    }
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
      author: author,
      categories: CATEGORIES,
      selected_category: question.category
    });
    question_thread.insertAdjacentHTML('afterbegin', html);

    var category_chooser = document.getElementById('category_chooser');
    category_chooser.addEventListener('change', function(evt) {
      var category = evt.target.value;
      if (category == question.category) {
        return;
      }
      SumoDB.set_category_for_question(category, question.id);
    });
  }

  function submit_comment(evt) {
    evt.preventDefault();
    var comment = question_field.value;

    if (comment === '') {
      return;
    }

    Utils.toggle_spinner();

    show_panel(question_thread);

    var failed = document.getElementsByClassName('js-failed');
    for(var i = 0, il = failed.length; i < il; i++) {
      var failed_comment = failed[i].parentElement;
      failed_comment.parentElement.removeChild(failed_comment);
    }

    var fake_comment = nunjucks.render('comment.html',
      {comment: {content: comment}});
    var list = document.getElementById('comment-list');
    var list_item = document.createElement('li');

    list.appendChild(list_item).innerHTML += fake_comment;
    User.get_user().then(function(user) {
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
      return Promise.all([submit_promise, user]);
    }).then(function([comment, user]) {

      Utils.toggle_spinner();

      question_field.value = '';

      // Only handle first time help message scenario for questions
      if (comment.answers) {
        asyncStorage.getItem('seen_first_question_help').then(function(resp) {
          // See if the flag exist
          if (!resp) {
            // flag does not exist, show the dialog and set the flag
            var dialog = document.querySelector('#first_question_help');
            dialog.classList.remove('hide');
            asyncStorage.setItem('seen_first_question_help', true);
          }
        });
      }

      comment.created = Utils.time_since(new Date(comment.created));
      comment.author = comment.creator.display_name || comment.creator.username;
      list_item.innerHTML = nunjucks.render('comment.html', {
        comment: comment,
        is_my_question: question_object.creator.username === user.username,
        user: user
      });
    }).catch(function() {
      list_item.innerHTML = nunjucks.render('comment.html', {
        comment: {content: comment, failed: true},
      });
    });
  }

  function submit_question(comment) {
    var user_meta = Utils.get_user_meta();
    return SumoDB.post_question(comment, user_meta).then(function(response) {
      question_id = response.id;
      question_object = response;
      return response;
    });
  }

  function submit_answer(question_id, comment) {
    return SumoDB.post_answer(question_id, comment).then(function(response) {
      return response;
    });
  }

  function load_question() {
    if (!question_id) {
      Utils.toggle_spinner();
      return;
    }

    show_panel(question_thread);

    var question_content = [];
    question_content.push(SumoDB.get_question(question_id));

    question_content.push(SumoDB.get_answers_for_question(question_id));

    Promise.all(question_content).
      then(check_if_taken).
      then(display_question).catch(function(err) {
        // We're just catching the taken case
      });
  }

  function check_if_taken([question, answers]) {
    // TODO bug 1136077
    return [question, answers];
  }

  function display_question([question, answers]) {
    Utils.toggle_spinner();

    question_object = question;
    solution_id = question.solution;
    if (solution_id) {
      close_question();
    }

    display_sign_in_if_needed(question);

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
    User.get_user().then(function(user) {
      var html = nunjucks.render('thread.html', {
        author: question.creator.display_name || question.creator.username,
        user: user,
        is_my_question: question.creator.username === user.username,
        solution_id: solution_id,
        results: answers
      });
      var list = document.getElementById('comment-list');
      list.insertAdjacentHTML('beforeend', html);
    });
  }

  function take_question(evt) {
    if (evt.target.value.length !== 1) {
      return;
    }
    if (!question_id) {
      return;
    }

    User.get_user().then(function(user) {
      var is_helper = user.username !== question_object.creator.username;
      if (is_helper) {
        SumoDB.take_question(question_id);
      }
    });
  }

  function show_panel(elt) {
    // Never hide the question panel
    if (!question_thread.classList.contains('hide')) {
      return;
    }

    var panels = [question_thread, suggestions, thread_introduction];
    panels.forEach(function(panel) {
      if (panel == elt) {
        panel.classList.remove('hide');
      } else {
        panel.classList.add('hide');
      }
    });
  }

  function give_suggestions(evt) {
    if (question_id) {
      return;
    }

    if (evt.target.value.length < 3) {
      show_panel(thread_introduction);
      return;
    }

    SumoDB.get_suggestions(evt.target.value, function(response) {
      if (response.questions.length + response.documents.length === 0) {
        show_panel(thread_introduction);
        return;
      }

      var kb_items = response.documents.map(function(kb_item) {
        return nunjucks.render('kb_item.html', {
          kb_item: kb_item
        });
      });
      var question_items = response.questions.map(function(question_item) {
        return nunjucks.render('question.html', {
          question: question_item
        });
      });

      suggestions.querySelector('ul').innerHTML =
        kb_items.concat(question_items).join('');
      show_panel(suggestions);
    });
  }

  // Needed when the user is not a helper nor the question creator
  function display_sign_in_if_needed(question) {
    User.get_user().then(function(user) {
      if (user.username == question.creator.username) {
        return;
      }
      User.is_helper().then(function(is_helper) {
        if (is_helper) {
          return;
        }
        // FIXME Careful with the presence of those elements
        document.getElementById('sign-in-link').classList.remove('hide');
        question_form.classList.add('hide');
      });
    });
  }

  var QuestionController = {
    init: function() {
      question_field = document.getElementById('question_field');
      question_field.addEventListener('input', take_question);
      question_field.addEventListener('input',
        _.throttle(give_suggestions, 500, {leading: false}));
      question_field.addEventListener('input', handle_autoresize);

      question_form = document.getElementById('question_form');
      question_form.addEventListener('submit', submit_comment);

      question_thread = document.getElementById('question-thread');
      question_thread.addEventListener('click', handle_event);
      suggestions = document.getElementById('suggestions');
      thread_introduction = document.getElementById('thread-introduction');

      // handle dialog close events
      close_dialog_handler();

      var question_view = location.search ? true : false;
      if (question_view) {
        var params = Utils.get_url_parameters(location);
        if (params.id) {

          Utils.toggle_spinner();

          question_id = params.id;
          load_question();
        }
      }
    }
  };
  exports.QuestionController = QuestionController;
  QuestionController.init();

})(window);
