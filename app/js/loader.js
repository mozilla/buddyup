'use strict';

/* global gettext, nunjucks */

(function(exports) {
  var Loader = {
    init: function() {
      var env = new nunjucks.Environment();
      env.addGlobal('_', gettext);

      var elems = document.querySelectorAll('[data-template]');

      for (var i=0; i < elems.length; i++) {
        var elem = elems[i];
        var html = nunjucks.render(elem.dataset.template);
        elem.innerHTML = html;
      }

      var event = new Event('initialize');
      document.dispatchEvent(event);
    }
  };

  exports.Loader = Loader;
  Loader.init();
})(window);
