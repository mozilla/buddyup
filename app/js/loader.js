'use strict';

/* global nunjucksEnv */

(function(exports) {
  var Loader = {
    init: function() {
      var elems = document.querySelectorAll('[data-template]');

      for (var i=0; i < elems.length; i++) {
        var elem = elems[i];
        var html = nunjucksEnv.render(elem.dataset.template);
        elem.innerHTML = html;
      }
    }
  };

  exports.Loader = Loader;
  Loader.init();
})(window);
