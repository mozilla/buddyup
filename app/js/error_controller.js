'use strict';

/* global nunjucks */

(function(exports) {
  var generic_error;

  var ErrorController = {
    init: function() {
      generic_error = document.getElementById('generic_error');

      document.addEventListener('network-error', function() {
        if (!generic_error) {
          var html = nunjucksEnv.render('generic_error.html');
          document.body.insertAdjacentHTML('beforeend', html);

          generic_error = document.getElementById('generic_error');
          generic_error.addEventListener('submit', function(evt) {
            evt.preventDefault();
            generic_error.classList.add('hide');
          });
        }

        generic_error.classList.remove('hide');
      });
    }
  };

  exports.ErrorController = ErrorController;
  ErrorController.init();
})(window);
