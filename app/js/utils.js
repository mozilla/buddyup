'use strict';

(function(exports) {

  var Utils = {
    /**
     * Show or hide the spinner based on it's current visibility status.
     */
    toggle_spinner: function() {
      var spinner = document.getElementById('spinner');

      // the spinner already exist in the DOM so, we just want to toggle
      // it's visibility.
      if (spinner) {
        spinner.classList.toggle('hide');
      } else {
        var span = document.createElement('span');
        span.setAttribute('id', 'spinner');
        span.setAttribute('data-icon', 'sync');

        span.classList.add('spinner');
        document.querySelector('body').appendChild(span);
      }
    },
    /**
     * Display a human-readable relative timestamp.
     * @param {String|Date} time before/after the currentDate.
     * @param {String} useCompactFormat whether to use a compact display format.
     */
    time_since: function(time, use_compact_format) {
      var mozl10n = new navigator.mozL10n.DateTimeFormat();
      return mozl10n.fromNow(time, use_compact_format);
    }
  };

  exports.Utils = Utils;

})(window);
