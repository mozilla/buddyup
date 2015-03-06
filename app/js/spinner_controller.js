'use strict';

(function(exports) {
  var request_count = 0;

  function get_spinner() {
    var spinner = document.getElementById('spinner');

    // If the spinner does not exist create it and hide it.
    if (!spinner) {
      spinner = document.createElement('span');
      spinner.setAttribute('id', 'spinner');
      spinner.setAttribute('data-icon', 'sync');

      spinner.classList.add('spinner');
      spinner.classList.add('hide');
      document.querySelector('body').appendChild(spinner);
    }

    return spinner;
  }

  var SpinnerController = {
    init: function() {
      document.addEventListener('request-start', function() {
        request_count++;
        var spinner = get_spinner();
        spinner.classList.remove('hide');
      });

      document.addEventListener('request-complete', function() {
        request_count--;
        if (request_count === 0) {
          var spinner = get_spinner();
          spinner.classList.add('hide');
        }
      });
    }
  };

  exports.SpinnerController = SpinnerController;
  SpinnerController.init();
})(window);
