'use strict';

/* global SumoDB, User, Utils, nunjucks */

(function(exports) {

  var MSG_NO_QUESTIONS = 'No questions found';
  var QUESTION_LIST_TMPL = 'question_list_day.html';

  var my_questions_list_container;
  var active_questions_list_container;
  var load_more_my_questions_button;
  var load_more_active_questions_button;

  /**
   * Toggles the state of the specified Aria attribute between true and false.
   * @param {array} elems - The array of elements to toggle state on.
   * @param {string} attribute - The ARIA attribute to toggle the state of.
   */
  function toggle_state(elems, attribute) {
    // loop through all elements and toggle their state.
    for (var i = 0, l = elems.length; i < l; i++) {
      var current_state = elems[i].getAttribute(attribute);
      var new_state = current_state === 'true' ? false : true;

      elems[i].setAttribute(attribute, new_state);
    }
  }

  /**
   * Sets the specified tab to the active state. Also toggles the aria-hidden
   * state of the relevant tab panels.
   * @param {object} container - The tab container
   * @param {object} tab - The tab that received the click event.
   */
  function set_active_tab(container, tab) {
    // Do not toggle if the clicked tab is a selected tab
    if (tab.getAttribute('aria-selected') === 'true') {
      return;
    }

    var tabs = container.querySelectorAll('[role="tab"]');
    toggle_state(tabs, 'aria-selected');

    var tab_panels = container.querySelectorAll('[role="tabpanel"]');
    toggle_state(tab_panels, 'aria-hidden');
  }

  /**
   * Handles click/tap events on tabbed views.
   */
  function add_tab_widget_handler() {
    var tabs_container = document.querySelector('.tabbed-section');
    if (!tabs_container) {
      return;
    }

    tabs_container.addEventListener('click', function(event) {
      var event_trigger = event.target;
      var role = event_trigger.getAttribute('role');

      if (role === 'tab') {
        event.preventDefault();
        set_active_tab(tabs_container, event_trigger);
      }
    });
  }

  function load_active_questions() {
    User.get_user().then(function(user) {
      return SumoDB.get_active_questions(user.username);
    }).then(function(response) {
      display_questions(response, active_questions_list_container,
          load_more_active_questions_button);
    });
  }

  function load_initial_questions() {
    var params = Utils.get_url_parameters(location);

    var promise;
    if ('helper' === params.role) {
      promise = User.get_user().then(function(user) {
        return SumoDB.get_unanswered_questions(user.locale);
      });
    } else {
      promise = User.get_user().then(SumoDB.get_my_questions);
    }

    promise.then(function(response) {
      if (response.results.length) {
        // if the data-all attribute does not exist on the container then
        // the template is going to be embedded on the landing screen,
        // so we need to trim down the results to the latest three.
        if (!my_questions_list_container.dataset.all) {
          response.results = response.results.slice(0, 3);
        }

        var all_questions = document.getElementById('all_questions_button');
        if (all_questions) {
          all_questions.classList.remove('hide');
        }
      }

      display_questions(response, my_questions_list_container,
          load_more_my_questions_button);
    });
  }

  function load_more_questions(evt) {
    var load_more_button = evt.target;
    var url = load_more_button.dataset.next;
    var container = load_more_button.parentElement
        .getElementsByClassName('js-question-container')[0];
    if (container) {
      SumoDB.get_question_list(url).then(function(response) {
        display_questions(response, container, load_more_button);
      });
    }
  }

  function display_questions(response, container, load_more_button) {
    var results = response.results;
    var html;

    if (results.length) {
      for (var i = 0, l = results.length; i < l; i++) {
        var updated = results[i].updated;
        results[i].updated_day = updated.split('T')[0];
        results[i].updated = Utils.time_since(new Date(updated));
      }

      if (load_more_button && response.next) {
        load_more_button.classList.remove('hide');
        load_more_button.dataset.next = response.next;
      } else if (load_more_button) {
        load_more_button.classList.add('hide');
      }

      html = nunjucks.render(QUESTION_LIST_TMPL, {
        next: response.next,
        results: results
      });
      container.insertAdjacentHTML('beforeend', html);
    } else {
      html = nunjucks.render(QUESTION_LIST_TMPL, {
        message: MSG_NO_QUESTIONS
      });
      container.insertAdjacentHTML('beforeend', html);
    }
  }

  function display_sign_in_if_needed() {
    User.is_helper().then(function(is_helper) {
      if (is_helper) {
        return;
      }

      var sign_in = document.getElementById('sign-in-link');
      if (sign_in) {
        sign_in.classList.remove('hide');
      }
      var new_active_tabs = document.getElementById('new-active-tabs');
      if (new_active_tabs) {
        new_active_tabs.classList.add('hide');
      }
    });
  }

  var QuestionsController = {
    init: function() {
      load_more_my_questions_button = document.getElementById(
          'load-more-my-questions');
      if (load_more_my_questions_button) {
        load_more_my_questions_button.addEventListener('click',
            load_more_questions);
      }

      load_more_active_questions_button = document.getElementById(
          'load-more-active-questions');
      if (load_more_active_questions_button) {
        load_more_active_questions_button.addEventListener('click',
            load_more_questions);
      }

      nunjucks.configure({ autoescape: true });

      add_tab_widget_handler();
      display_sign_in_if_needed();

      my_questions_list_container = document.getElementById('myquestions');
      active_questions_list_container = document.getElementById(
          'activequestions');

      load_initial_questions();
      load_active_questions();
    }
  };

  exports.QuestionsController = QuestionsController;
  QuestionsController.init();

})(window);
