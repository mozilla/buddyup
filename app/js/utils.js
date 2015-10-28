'use strict';

/* global MobileOperator */

(function(exports) {
  const GECKO_TO_FXOS = {
    '18.0': '1.0.1',
    '18.1': '1.1',
    '26.0': '1.2',
    '28.0': '1.3',
    '30.0': '1.4',
    '32.0': '2.0',
    '34.0': '2.1',
  };
  /* jshint -W101 */
  /* Adapted from https://developer.mozilla.org/en-US/docs/Web/HTTP/Gecko_user_agent_string_reference */
  /* jshint +W101 */

  function gecko_to_fxos(gecko_version) {
    return GECKO_TO_FXOS[gecko_version];
  }

  /* jshint -W101 */
  // Adapted from https://github.com/WhichBrowser/WhichBrowser/blob/master/data/models-firefoxos.php
  /* jshint +W101 */
  const DEVICES = [
    {useragent: 'ALCATEL ONE TOUCH FIRE',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire'},
    {useragent: 'ALCATEL ONE TOUCH 4012A',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire' },
    {useragent: 'ALCATEL ONE TOUCH 4012X',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire' },
    {useragent: 'ALCATELOneTouch4012A',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire' },
    {useragent: 'ALCATELOneTouch4012X',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire' },
    {useragent: 'OneTouch4019A',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire C' },
    {useragent: 'ALCATELOneTouch4019A',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire C' },
    {useragent: 'ALCATELOneTouch4019X',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire C' },
    {useragent: 'ALCATELOneTouch4020D',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire C' },
    {useragent: 'ALCATELOneTouch4022',
      manufacturer: 'Alcatel',
      model: 'One Touch Pixi 3 (3.5)' },
    {useragent: 'ALCATELOneTouch4023',
      manufacturer: 'Alcatel',
      model: 'One Touch Pixi 3 (3.5)' },
    {useragent: 'ALCATELOneTouch6015X',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire E' },
    {useragent: 'OneTouch6015X',
      manufacturer: 'Alcatel',
      model: 'One Touch Fire E' },
    {useragent: 'HUAWEI Ascend Y300-F1',
      manufacturer: 'Huawei',
      model: 'Ascend Y300 F1' },
    {useragent: 'HUAWEIY300-F1',
      manufacturer: 'Huawei',
      model: 'Ascend Y300 F1' },
    {useragent: 'LG-D300',
      manufacturer: 'LG',
      model: 'Fireweb' },
    {useragent: 'LGL25',
      manufacturer: 'LG',
      model: 'Fx0' },
    {useragent: 'madai',
      manufacturer: 'LG',
      model: 'Fx0' },
    {useragent: 'ZTEOPEN',
      manufacturer: 'ZTE',
      model: 'Open' },
    {useragent: 'OpenC',
      manufacturer: 'ZTE',
      model: 'Open C' },
    {useragent: 'Open C',
      manufacturer: 'ZTE',
      model: 'Open C' },
    {useragent: 'OPEN2',
      manufacturer: 'ZTE',
      model: 'Open II' },
  ];

  const LOCALIZED_ERRORS = {
    'This field is required.': gettext('This field is required.'),
    'Unable to log in with provided credentials.': gettext('Unable to log in with provided credentials.'),
    'A user with that email address already exists.': gettext('A user with that email address already exists.'),
    'A user with that username exists': gettext('A user with that username exists'),
    "Can't change this field.": gettext("Can't change this field."),
    'Usernames may only be letters, numbers, "." and "-".': gettext('Usernames may only be letters, numbers, "." and "-".'),
    'No matching user setting found.': gettext('No matching user setting found.'),
    'Unable to generate username.': gettext('Unable to generate username.'),
    'User account is disabled.': gettext('User account is disabled.'),
    'Enter a valid email address.': gettext('Enter a valid email address.'),
  };

  function useragent_to_device(useragent) {
    var device = DEVICES.find(function(device) {
      return useragent.toLowerCase().startsWith(device.useragent.toLowerCase());
    });

    if (device) {
      return device.manufacturer + ' ' + device.model;
    }
  }

  var Utils = {
    /**
     * Display a human-readable relative timestamp. Times in the future
     * are reported as "just now".
     *
     * Localizes its output.
     *
     * @param {String|Date} time before the current time.
     */
    time_since: function(time) {
      var now = new Date();
      var delta = now - time;
      // delta is the number of milliseconds between the events.
      // convert delta to minutes
      delta = Math.round(delta / 60 / 1000);

      if (delta <= 0) {
        return gettext('just now');
      }

      if (delta < 60) {
        return ngettext('{n} minute ago', '{n} minutes ago', {n: delta});
      }

      //convert delta to hours
      delta = Math.round(delta / 60);
      if (delta < 24) {
        return ngettext('{n} hour ago', '{n} hours ago', {n: delta});
      }

      // convert delta to days
      delta = Math.round(delta / 24);
      // Don't use units larger than days
      return ngettext('{n} day ago', '{n} days ago', {n: delta});
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

    get_gecko_version: function() {
      var gecko = navigator.userAgent.match(/rv:([\d\.]+)/);
      if (gecko) {
        return gecko[1];
      }
    },

    /**
     * Returns meta data gathered from the device to attach to questions
     * for better categorization and filtering.
     */
    get_user_meta: function() {
      var metas = [];

      var gecko = Utils.get_gecko_version();
      if (gecko) {
        metas.push({
          name: 'os_version',
          value: gecko
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
    },

    convert_metadata_for_display: function(metas) {
      var result = {};
      metas.forEach(function(meta) {
        switch(meta.name) {
          case 'os_version':
            result[meta.name] = gecko_to_fxos(meta.value);
          break;
          case 'handset_type':
            result[meta.name] = useragent_to_device(meta.value);
          break;
          default:
            result[meta.name] = meta.value;
          break;
        }
      });
      return result;
    },

    /**
     * Clear then load the list of errors for a field or a form.
     */
    refresh_error_list: function(list, errors) {
      list.innerHTML = '';
      if (errors) {
        for (var i in errors) {
          var localizedError;
          if (errors[i] in LOCALIZED_ERRORS) {
            localizedError = LOCALIZED_ERRORS[errors[i]];
          } else {
            localizedError = gettext('Unknown error: "{error}"', {error: errors[i]});
          }
          var error = document.createElement('li');
          error.appendChild(document.createTextNode(localizedError));
          list.appendChild(error);
        }
      }
    },

    /*
     * Returns object that contains promise and related resolve\reject methods
     * to avoid wrapping long or complex code into single Promise constructor.
     * @returns {{promise: Promise, resolve: function, reject: function}}
     */
    defer: function() {
      var deferred = {};

      deferred.promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });

      return deferred;
    },

    get_supported_device_language() {
      var user_meta = Utils.get_user_meta();
      for (var i = 0; i < Settings.LOCALES.length; i++) {
        if (Settings.LOCALES[i][0] == user_meta.lang) {
          return user_meta.lang;
        }
      }
      return Settings.LOCALES[0][0];
    }
  };

  // Prevent default context menu and click the element instead
  window.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
    evt.target.click();
  });

  exports.Utils = Utils;

})(window);
