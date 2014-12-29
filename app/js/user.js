'use strict';

/* global SumoDB, asyncStorage */

(function(exports) {
  var USER_CREDENTIALS_KEY = 'user_credentials';
  var USER_KEY = 'user';

  function normalize_user(user) {
    user.display_name = user.display_name || user.username;

    /* FIXME : Temporary hardcoded values */
    user.settings = [{ name: 'new_comment_notify', value: false },
      { name: 'buddyup_reminder', value: false }];
    user.handset_type = 'Alcatel';
    user.operator = 'MTN';

    return user;
  }


  /**
   * Create and store new user.
   */
  function create_user() {
    return SumoDB.create_user().then(function(response) {
      var promises = [];

      promises.push(asyncStorage.setItem(USER_CREDENTIALS_KEY, {
        username: response.user.username,
        password: response.password,
        token: response.token
      }));

      var normalized_user = normalize_user(response.user);
      normalized_user.last_sync = Date.now();
      promises.push(asyncStorage.setItem(USER_KEY, normalized_user));

      return Promise.all(promises).then(function() {
        return normalized_user;
      });
    });
  }

  var User = {
    /**
    * Get's the current user's credentials from local storage. If no
    * credentials exist, there is no user, so ask the server to generate a new
    * user (helpee) and then read the new user's credentials from local storage
    * that would have been set by create_user
    */
    get_credentials: function() {
      return asyncStorage.getItem(USER_CREDENTIALS_KEY)
      .then(function(credentials) {
        if (!credentials) {
          return create_user().then(User.get_credentials);
        }

        return credentials;
      });
    },

    /**
    * Get the user from local storage. If no user exists, ask the server
    * to generate a new user (helpee) and return the new user. If the user
    * exists, make sure that the user data is no older than 15 minutes, then
    * return the user.
    *
    * If the local user data is older than 15 minutes, get a refereshed copy
    * of the user details from the server and return the new data.
    */
    get_user: function() {
      return asyncStorage.getItem(USER_KEY).then(function(user) {
        if (!user) {
          return create_user();
        }

        // if user was synced in the last 15 minutes return
        if (Date.now() - user.last_sync <= 15 * 60 * 1000) {
          return user;
        }

        return SumoDB.get_user(user.username).then(function(user) {
          var normalized_user = normalize_user(user);
          normalized_user.last_sync = Date.now();
          return asyncStorage.setItem('user', normalized_user).then(function() {
            return normalized_user;
          });
        });
      });
    },

    /**
    * Sets or updates the specific user preference on the server and locally.
    * @param {string} pref - The preference to set
    * @param {boolean} status - The status of the preference.
    */
    set_preference: function(pref, status) {
      var settings = {
        'name': pref,
        'value': status
      };

      User.get_user().then(function(user) {
        SumoDB.update_preference(user, settings).then(function(setting) {
          for (var i = 0, l = user.settings.length; i < l; i++) {
            var current_setting = user.settings[i].name;
            if (current_setting === setting.name) {
              user.settings[i] = setting;
              break;
            }
          }
          asyncStorage.setItem(USER_KEY, user);
        });
      });
    }
  };
  exports.User = User;

})(window);
