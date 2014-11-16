'use strict';

/* global localforage */

(function(exports) {

  var LOCALE = 'en-US';
  var USERNAME = 'rik24d';
  var PASSWORD = 'foobarbaz1';

  var UserController = {
    /**
     * Get a user from local storage.
     */
    get_user: function() {
      return localforage.getItem('user').then(function(response) {
          return response;
      });
    },
    create_user: function() {
      // tmp, this will be replaced with a call to the server
      // to create the user.
      var user = {
        username: USERNAME,
        password: PASSWORD,
        locale: LOCALE
      };
      return localforage.setItem('user', user).then(function(response) {
        return response;
      });
    }
  };
  exports.UserController = UserController;

})(window);
