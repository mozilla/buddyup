'use strict';

/* global SumoDB, asyncStorage */

(function(exports) {

  /**
   *
   */
  function normalize_user(response) {
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
      buddyup_reminder: true,
      handset_type: 'Alcatel',
      operator: 'MTN'
    };
  }

  var UserController = {
    /**
     * Get a user from local storage.
     */
    get_user: function() {
      return new Promise(function(resolve, reject) {
        asyncStorage.getItem('user', resolve);
      });
    },
    /**
     * Create and store new user.
     */
    create_user: function() {
      return SumoDB.create_user().then(function(response) {
        return new Promise(function(resolve, reject) {
          asyncStorage.setItem('user', normalize_user(response), resolve);
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
     * Sets or updates the specific user preference on the server
     * and locally.
     * @param {string} pref - The preference to set
     * @param {boolean} status - The status of the preference.
     */
    set_preference: function(pref, status) {
      var preference = {};
      preference[pref] = status;

      SumoDB.update_preference(preference).then(function(response) {
        UserController.get_user().then(function(user) {
          user[pref] = status;
          asyncStorage.setItem('user', user);
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
        // does a user already exist?
        if (response) {
          return response;
        } else {
          // no user exists, ask the server to generate a new user.
          return UserController.create_user().then(function(response) {
            return response;
          });
        }
      });
    }
  };
  exports.UserController = UserController;

})(window);
