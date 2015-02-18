'use strict';

/* global SumoDB, nunjucks */

(function(exports) {
  var USERS_LIST_TMPL = 'users_list.html';

  var top_helpers_container;

  function load_top_helpers() {
    var promise = SumoDB.get_top_helpers();

    promise.then(function(users) {
      if (users.length) {
        top_helpers_container.classList.remove('hide');
      }

      var html = nunjucks.render(USERS_LIST_TMPL, {
        users: users.slice(0, 5)
      });

      top_helpers_container.insertAdjacentHTML('beforeend', html);
    });
  }

  var HomeController = {
    init: function() {
      nunjucks.configure({ autoescape: true });

      top_helpers_container = document.getElementById('tophelpers');

      load_top_helpers();
    }
  };

  exports.HomeController = HomeController;
  HomeController.init();
})(window);
