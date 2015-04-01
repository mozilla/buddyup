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
          var error = document.createElement('li');
          error.appendChild(document.createTextNode(errors[i]));
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
    }
  };

  exports.Utils = Utils;

})(window);
