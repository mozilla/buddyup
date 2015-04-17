'use strict';

/* global Event, Settings, Utils */

(function(exports) {

  function init() {
    var parameters = Utils.get_url_parameters(location);
    var kb_url = Settings.BASE_SERVER;
    kb_url += '/' + navigator.language;
    kb_url += '/kb/';
    kb_url += parameters.slug;
    kb_url += '?mobile=1&minimal=1';

    var kb_view = document.getElementById('kb-view');
    kb_view.addEventListener('load', function() {
      var event = new Event('request-complete');
      document.dispatchEvent(event);
    });

    var event = new Event('request-start');
    document.dispatchEvent(event);
    kb_view.src = kb_url;


  }

  window.addEventListener('load', init);
})(window);
