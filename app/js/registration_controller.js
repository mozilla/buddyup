'use strict';

/* global User, Utils */

(function(exports) {
  function register_user(evt) {
    evt.preventDefault();

    var form = document.getElementById('register');
    var email = form.elements.email.value;
    var username = form.elements.username.value;
    var password = form.elements.password.value;

    var promise = User.register(username, password, email);

    Utils.toggle_spinner();

    promise.then(function() {
      var success = document.getElementById('success_message');
      var success_email = document.getElementById('success_email');
      success_email.appendChild(document.createTextNode(email));
      form.classList.add('hide');
      success.classList.remove('hide');
      Utils.toggle_spinner();
    }).catch(function(response) {
      var errors = JSON.parse(response);

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

      Utils.toggle_spinner();
    });
  }

  function register_form() {
    var register_form = document.getElementById('register');
    register_form.addEventListener('submit', register_user);
  }

  var RegistrationController = {
    init: function() {
      register_form();
    }
  };

  exports.RegisterationController = RegistrationController;
  RegistrationController.init();

})(window);
