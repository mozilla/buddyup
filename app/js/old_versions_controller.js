'use strict';

(function(exports) {

  var OldVersionsController = {
    init: function() {
      var close_button = document.getElementById('close_button');
      close_button.addEventListener('click', function(evt) {
        evt.preventDefault();
        window.parent.close();
      });
    }
  };

  exports.OldVersionsController = OldVersionsController;

  document.addEventListener('initialize', function() {
    OldVersionsController.init();
  });
})(window);
