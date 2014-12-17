'use strict';

/* global SumoDB, User, Utils, nunjucks */

(function(exports) {

  var ANSWER_QUESTION_HEADING = 'Answer A Question';
  var MSG_NO_QUESTIONS = 'No questions found';
  var QUESTIONS_TMPL_HELPEE = 'helpee_questions.html';
  var QUESTIONS_TMPL_HELPER = 'helper_questions.html';

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

  /**
   * Shows a list of questions for the current user.
   * @params {object} container - The container for the list.
   */
  function show_questions(container) {

    var html;
    var params = Utils.get_url_parameters(location);
    var tmpl = QUESTIONS_TMPL_HELPEE;

    var promise;
    if ('helper' === params.role) {
      // as this is a helper, the view is now for answer a question.
      // update the page title and heading.
      var heading = document.getElementById('main_heading');
      var title = document.querySelector('title');

      heading.textContent = ANSWER_QUESTION_HEADING;
      title.textContent = ANSWER_QUESTION_HEADING;
      promise = SumoDB.get_unanswered_questions();

      tmpl = QUESTIONS_TMPL_HELPER;
    } else {
      promise = User.get_user().then(SumoDB.get_my_questions);
    }

    promise.then(function(results) {

      if (results.length) {
        Utils.toggle_spinner();

        for (var i = 0, l = results.length; i < l; i++) {
          var created = results[i].created;
          results[i].created = Utils.time_since(new Date(created));
        }

        // if the data-all attrbiute does not exist on the container then
        // the template is going to be embedded on the landing screen,
        // so we need to trim down the results to the latest three.
        if (!container.dataset.all) {
          results = results.slice(0, 3);
          // only show the header on the landing screen.
          results.show_header = true;
        }

        html = nunjucks.render(tmpl, { results: results });
        container.innerHTML = html;

        add_tab_widget_handler();

      } else {
        // no questions for the user, render the template passing
        // relevant message to user.
        Utils.toggle_spinner();
        html = nunjucks.render(QUESTIONS_TMPL_HELPEE, {
          message: MSG_NO_QUESTIONS
        });
        container.innerHTML = html;
      }

    });
  }

  var QuestionsController = {
    init: function() {
      nunjucks.configure({ autoescape: true });

      Utils.toggle_spinner();

      var my_questions = document.querySelector('#myquestions');
      show_questions(my_questions);
    }
  };

  exports.QuestionsController = QuestionsController;
  QuestionsController.init();

})(window);
