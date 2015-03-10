'use strict';

/* global User, Utils */

(function(exports) {
  var EMAIL_CONFIRMATION_TMPL = 'email_confirmation.html';
  var success_msg;
  var confirmation_poll_timeout;

  function check_for_email_confirmation(username) {
    return User.is_active(username).then(function(active) {
      if (active) {
        User.authenticate_temporary_user();
        success_msg.classList.add('hide');
      }
      return active;
    });
  }

  function poll_for_email_confirmation(username) {
    confirmation_poll_timeout = window.setTimeout(function() {
      var promise = check_for_email_confirmation(username);

      promise.then(function(active) {
        if (!active) {
          poll_for_email_confirmation(username);
        }
      });
    }, 5000);
  }

  function register_user(evt) {
    evt.preventDefault();

    var form = document.getElementById('register');
    var email = form.elements.email.value;
    var username = form.elements.username.value;
    var password = form.elements.password.value;

    var promise = User.register(username, password, email);

    promise.then(function() {
      success_msg.src = EMAIL_CONFIRMATION_TMPL + '?email=' + email;
      success_msg.classList.remove('hide');
      form.classList.add('hide');

      poll_for_email_confirmation(username);

      document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
          check_for_email_confirmation(username);
        }
      });
    }, function(response) {
      var errors = JSON.parse(response.responseText);

      Utils.refresh_error_list(
        document.getElementById('register_errors'),
        errors.non_field_errors);

      Utils.refresh_error_list(
        document.getElementById('email_errors'),
        errors.email);

      Utils.refresh_error_list(
        document.getElementById('username_errors'),
        errors.username);

      Utils.refresh_error_list(
        document.getElementById('password_errors'),
        errors.password);
    });
  }

  function register_form() {
    var register_elem = document.getElementById('register');
    register_elem.addEventListener('submit', register_user);
  }

  var RegistrationController = {
    init: function() {
      success_msg = document.getElementById('success_message');
      register_form();
    }
  };

  exports.RegisterationController = RegistrationController;
  RegistrationController.init();

})(window);
