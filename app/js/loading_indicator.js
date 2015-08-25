'use strict';

(function(exports) {
  var request_count = 0;

  function get_indicator() {
    var indicator = document.getElementById('indicator');

    // If the indicator does not exist create it and hide it.
    if (!indicator) {
      indicator = document.createElement('progress');
      indicator.setAttribute('id', 'indicator');
      indicator.value = 0;

      indicator.classList.add('pack-activity');
      indicator.classList.add('hide');
      var building_block_selector;
      building_block_selector = 'section[role="region"] > header:first-child';
      document.querySelector(building_block_selector).appendChild(indicator);
    }

    return indicator;
  }

  var LoadingIndicator = {
    init: function() {
      document.addEventListener('request-start', function() {
        request_count++;
        var indicator = get_indicator();
        indicator.classList.remove('hide');
      });

      document.addEventListener('request-complete', function() {
        request_count--;
        if (request_count === 0) {
          var indicator = get_indicator();
          indicator.classList.add('hide');
        }
      });
    }
  };

  exports.LoadingIndicator = LoadingIndicator;
  LoadingIndicator.init();
})(window);
