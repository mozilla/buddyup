'use strict';

/* global SumoDB, localforage */

(function(exports) {

  var UserController = {
    /**
     * Get a user from local storage.
     */
    get_user: function() {
      return localforage.getItem('user').then(function(response) {
        return response;
      });
    },
    /**
     * Create and store new user.
     */
    create_user: function() {
      return SumoDB.create_user().then(function(response) {
        var hash_password = response.password;
        var token = response.token;
        var user = response.user;

        var local_user = {
          username: user.username,
          display_name: user.display_name,
          avatar: user.avatar,
          password: hash_password,
          token: token,
          locale: user.locale,
          member_since: user.date_joined
        };

        return localforage.setItem('user', local_user).then(function(response) {
          return response;
        });
      });
    },
    /**
     * Loads the user from local storage. If not found, makes a call
     * to the server to create a new ad-hoc user, then stores the new
     * user in localStorage.
     * @returns the user Object
     */
    init: function() {
      return this.get_user().then(function(response) {
        if (response) {
          return response;
        } else {
          UserController.create_user().then(function(response) {
            return response;
          });
        }
      });
    }
  };
  exports.UserController = UserController;

})(window);
