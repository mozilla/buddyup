'use strict';

/* global User, Utils */

(function(exports) {
  function authenticate(evt) {
    evt.preventDefault();

    var form = document.getElementById('login');
    var username = form.elements.username.value;
    var password = form.elements.password.value;

    var promise = User.authenticate_user(username, password);


    promise.then(function() {
      window.parent.Navigation.close_current_view();
    }).catch(function(response) {
      var errors = JSON.parse(response.responseText);

      Utils.refresh_error_list(
        document.getElementById('login_errors'),
        errors.non_field_errors);

      Utils.refresh_error_list(
        document.getElementById('username_errors'),
        errors.username);

      Utils.refresh_error_list(
        document.getElementById('password_errors'),
        errors.password);
    });
  }

  function register_form() {
    var login = document.getElementById('login');
    login.addEventListener('submit', authenticate);
  }

  var AuthenticationController = {
    init: function() {
      register_form();
    }
  };

  exports.AuthenticationController = AuthenticationController;
  AuthenticationController.init();

})(window);
