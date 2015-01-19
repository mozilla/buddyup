'use strict';

/* global SumoDB, asyncStorage */

(function(exports) {
  var USER_CREDENTIALS_KEY = 'user_credentials';
  var USER_KEY = 'user';

  /**
   * Ensures the display name is set correctly and then for new users, this
   * creates the expected settings with default values, and for existing users,
   * this flattens out the settings object array.
   * @param {object} user - The user object to nomalize
   * @returns The normalized user
   */
  function normalize_user(user) {
    user.display_name = user.display_name || user.username;
    // newly created users will not have any settings so,
    // we set the defaults here.
    if (!user.settings) {
      user.new_comment_notify = false;
      user.buddyup_reminder = false;
      user.handset_type = ['All'];
      user.operator = 'All';
    } else {
      // this is not a new user so, just flatten the setting for
      // easier use in the profile template.
      for (var i = 0, l = user.settings.length; i < l; i++) {
        var setting = user.settings[i];
        // for the checkboxes we want to normalize the strings to booleans
        if (setting.name === 'new_comment_notify' ||
          setting.name === 'buddyup_reminder') {
            user[setting.name] = setting.value === 'True' ? true : false;
        } else {
          user[setting.name] = setting.value;
        }
      }
    }
    return user;
  }

  function set_user(username, password, token) {
    return set_credentials(username, password, token).then(function() {
      return SumoDB.get_user(username).then(sync_user);
    });
  }

  /**
   * Create and store new user.
   */
  function create_user() {
    return SumoDB.create_user().then(function(response) {
      var promises = [];

      promises.push(set_credentials(response.user.username, response.password,
        response.token));

      var normalized_user = normalize_user(response.user);
      normalized_user.last_sync = Date.now();
      promises.push(asyncStorage.setItem(USER_KEY, normalized_user));

      return Promise.all(promises).then(function() {
        return normalized_user;
      });
    });
  }

  function set_credentials(username, password, token) {
    return asyncStorage.setItem(USER_CREDENTIALS_KEY, {
      username: username,
      password: password,
      token: token
    });
  }

  function sync_user(user) {
    var normalized_user = normalize_user(user);
    normalized_user.last_sync = Date.now();
    return asyncStorage.setItem(USER_KEY, normalized_user).then(function() {
      return normalized_user;
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

        return SumoDB.get_user(user.username).then(sync_user);
      });
    },

    /**
     * Updates the local user data as well as last sync time.
     * @param {object} user_data - The ammended user data and settings i.e.
     * user_data = {
     *   user: user,
     *   settings, settings
     * };
     * @returns The updated user object from indexedDB
     */
    update_user: function(user_data) {
      return SumoDB.update_user(user_data).then(sync_user);
    },

    authenticate_user: function(username, password) {
      return SumoDB.get_token(username, password).then(function(token) {
        return set_user(username, password, token);
      });
    }
  };
  exports.User = User;

})(window);
