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

    promise.then(function() {
      form.classList.add('hide');
      window.parent.Navigation.go_to_view('email_confirmation.html');
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
      register_form();
    }
  };

  exports.RegisterationController = RegistrationController;
  RegistrationController.init();
})(window);
