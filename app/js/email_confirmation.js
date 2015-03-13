'use strict';

/* global Navigation, User */

(function(exports) {
  var EmailConfirmation = {
    init: function() {
      User.get_temporary_user().then(function(user) {
        if (user) {
          Navigation.go_to_view('email_confirmation.html');
        }
      });
    }
  };

  exports.EmailConfirmation = EmailConfirmation;
  EmailConfirmation.init();
})(window);
