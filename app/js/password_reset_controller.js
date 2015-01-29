'use strict';

/* global SumoDB, Utils */

(function(exports) {
  function request_password_reset(evt) {
    evt.preventDefault();

    var form = document.getElementById('pw_reset');
    var username = form.elements.username.value;

    var promise = SumoDB.request_password_reset(username);

    Utils.toggle_spinner();

    promise.then(function() {
      var success = document.getElementById('success_message');
      form.classList.add('hide');
      success.classList.remove('hide');
      Utils.toggle_spinner();
    }).catch(function(response) {
      Utils.refresh_error_list(
        document.getElementById('pw_reset_errors'),
        ['User not found.']);
      Utils.toggle_spinner();
    });
  }

  function register_form() {
    var pw_reset = document.getElementById('pw_reset');
    pw_reset.addEventListener('submit', request_password_reset);
  }

  var PasswordResetController = {
    init: function() {
      register_form();
    }
  };

  exports.PasswordResetController = PasswordResetController;
  PasswordResetController.init();

})(window);
