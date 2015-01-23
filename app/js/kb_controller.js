'use strict';

/* global Settings, Utils */

(function(exports) {

  function init() {
    var parameters = Utils.get_url_parameters(location);
    var kb_url = Settings.BASE_SERVER;
    kb_url += '/' + navigator.language;
    kb_url += '/kb/';
    kb_url += parameters.slug;
    kb_url += '?mobile=1&minimal=1';

    document.getElementById('kb-view').src = kb_url;
  }
  init();

})(window);
