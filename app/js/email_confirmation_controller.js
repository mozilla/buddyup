'use strict';

/* global Utils */

(function(exports) {
  var EmailConfirmationController = {
    init: function() {
      var params = Utils.get_url_parameters(location);
      if (params.email) {
        var success_email = document.getElementById('success_email');
        success_email.appendChild(document.createTextNode(params.email));
      }
    }
  };

  exports.EmailConfirmationController = EmailConfirmationController;
  EmailConfirmationController.init();
})(window);
