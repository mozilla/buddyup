'use strict';

(function(exports) {

  var UnsupportedLocaleController = {
    init: function() {
      var continue_button = document.getElementById('continue_button');
      continue_button.addEventListener('click', function() {
        window.parent.Navigation.close_current_view();
      });

      var cancel_button = document.getElementById('cancel_button');
      cancel_button.addEventListener('click', function() {
        window.parent.close();
      });

      var lang_tag = document.getElementById('language');
      lang_tag.innerHTML = navigator.language;
    }
  };

  exports.UnsupportedLocaleController = UnsupportedLocaleController;

  document.addEventListener('initialize', function() {
    UnsupportedLocaleController.init();
  });
})(window);
