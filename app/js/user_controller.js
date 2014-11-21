'use strict';

/* global SumoDB, localforage */

(function(exports) {

  /**
   *
   */
  function normalize_user(user) {
    var hash_password = response.password;
    var token = response.token;
    var user = response.user;
    var name = !!user.display_name ? user.display_name : user.username;

    return {
      username: user.username,
      display_name: name,
      avatar: user.avatar,
      password: hash_password,
      token: token,
      locale: user.locale,
      member_since: user.date_joined,
      questions_answered: 10,
      helpful_upvotes: 2,
      new_comment_notify: true,
      buddyup_reminder: false,
      handset_type: 'Alcatel',
      operator: 'MTN'
    };
  }

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
        return localforage.setItem('user', normalize_user(response))
          .then(function(response) {
            return response;
        });
      });
    },
    /**
     * Updates the user data in localStorage.
     * @params {object} user_data - The new user data
     */
    update_user_local: function(user_data) {

    },
    /**
     * Loads the user from local storage. If not found, makes a call
     * to the server to create a new ad-hoc user, then stores the new
     * user in localStorage.
     * @returns the user Object
     */
    init: function() {
      return this.get_user().then(function(response) {
        // does a user already exist?
        if (response) {
          return response;
        } else {
          // no user exists, aske the server to generate a new user.
          return UserController.create_user().then(function(response) {
            return response;
          });
        }
      });
    }
  };
  exports.UserController = UserController;

})(window);
