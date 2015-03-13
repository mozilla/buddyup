'use strict';

/* global User */

(function(exports) {
  var confirmation_poll_timeout;
  var tmp_user;

  function check_for_email_confirmation() {
    if (tmp_user) {
      return User.is_active(tmp_user.username).then(function (active) {
        if (active) {
          User.authenticate_temporary_user().then(function() {
            window.parent.Navigation.close_current_view();
          });
        }
        return active;
      });
    }
    return Promise.resolve(true);
  }

  function poll_for_email_confirmation() {
    confirmation_poll_timeout = window.setTimeout(function() {
      var promise = check_for_email_confirmation();

      promise.then(function(active) {
        if (!active) {
          poll_for_email_confirmation();
        }
      });
    }, 5000);
  }

  function handle_visibility_change() {
    if (!document.hidden) {
      if (confirmation_poll_timeout) {
        clearTimeout(confirmation_poll_timeout);
      }
      poll_for_email_confirmation();
    }
  }

  var EmailConfirmationController = {
    init: function() {
      var cancel_button = document.getElementById('cancel_button');
      cancel_button.addEventListener('click', function() {
        User.clear_temporary_user().then(function() {
          window.parent.Navigation.close_current_view();
        });
      });

      User.get_temporary_user().then(function(user) {
        tmp_user = user;

        var success_email = document.getElementById('success_email');
        success_email.appendChild(document.createTextNode(user.email));

        poll_for_email_confirmation();

        document.addEventListener('visibilitychange', handle_visibility_change);
      });
    }
  };

  exports.EmailConfirmationController = EmailConfirmationController;
  EmailConfirmationController.init();
})(window);
