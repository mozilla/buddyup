'use strict';

/* global SumoDB, nunjucksEnv */

(function(exports) {
  var USERS_LIST_TMPL = 'users_list.html';

  var top_helpers_container;

  function load_top_helpers() {
    var promise = SumoDB.get_top_helpers();

    promise.then(function(users) {
      if (!users.length) {
        return;
      }

      var html = nunjucksEnv.render(USERS_LIST_TMPL, {
        users: users.slice(0, 5)
      });

      top_helpers_container.insertAdjacentHTML('beforeend', html);
      top_helpers_container.classList.remove('hide');
    });
  }

  var HomeController = {
    init: function() {
      top_helpers_container = document.getElementById('tophelpers');
      load_top_helpers();
    }
  };

  exports.HomeController = HomeController;

  document.addEventListener('initialize', function() {
    HomeController.init();
  });
})(window);
