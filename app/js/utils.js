'use strict';

/* global MobileOperator */

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
     */
    time_since: function(time) {
      var mozl10n = new navigator.mozL10n.DateTimeFormat();

      /* FIXME : We need to wait for L10N ready events */
      return mozl10n.fromNow(time);
    },
    /**
     * Retrieves url parameters and returns the key/value pairs as an object.
     */
    get_url_parameters: function(location) {
      var params = {};
      var urlParams = location.search.substring(1);
      var keyValuePairs = urlParams.split('&');

      for (var i = 0, l = keyValuePairs.length; i < l; i++) {
        var keyValue = keyValuePairs[i].split('=');
        params[keyValue[0]] = keyValue[1];
      }
      return params;
    },
    /**
     * Returns meta data gathered from the device to attach to questions
     * for better categorization and filtering.
     */
    get_user_meta: function() {
      var metas = [];

      var gecko = navigator.userAgent.match(/rv:([\d\.]+)/);
      if (gecko) {
        metas.push({
          name: 'os_version',
          value: gecko[1]
        });
      }

      var device = navigator.userAgent.match(/;(.+);/);
      if (device) {
        metas.push({
          name: 'handset_type',
          value: device[1].trim()
        });
      }

      var networks = MobileOperator.detectMobileNetworks();
      var operators = networks.map(function(network) {
        return MobileOperator.getNetwork(network.mcc, network.mnc, network.spn);
      });
      var operator = operators.find(function(operator) {
        return operator;
      });
      if (operator) {
        metas.push({
          name: 'operator',
          value: operator
        });
      }

      return {
        lang: navigator.language,
        metadata: metas
      };
    }
  };

  exports.Utils = Utils;

})(window);
