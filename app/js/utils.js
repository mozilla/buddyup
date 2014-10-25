'use strict';

(function(exports) {

  var Utils = {
    show_spinner: function(container) {
      var spinner = document.createElement('span');
      var parent = container ? container : document.documentElement;

      spinner.setAttribute('class', 'spinner');
      spinner.setAttribute('data-icon', 'sync');

      parent.appendChild(spinner);
    },
    remove_spinner: function(container) {
      var parent = container ? container : document.documentElement;
      parent.removeChild(document.querySelector('.spinner'));
    }
  };

  window.Utils = Utils;

})(window);
