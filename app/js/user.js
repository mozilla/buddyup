'use strict';

/* global SumoDB, asyncStorage */

(function(exports) {
  var USER_CREDENTIALS_KEY = 'user_credentials';
  var TMP_USER_CREDENTIALS_KEY = 'tmp_user_credentials';
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
    user.handset_type = [];
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

  function set_user(username, password, token, is_helper) {
    return set_credentials(username, password, token, is_helper)
    .then(function() {
      return SumoDB.get_user(username).then(sync_user);
    });
  }

  function set_inactive_user(username, password, email) {
    return asyncStorage.setItem(TMP_USER_CREDENTIALS_KEY, {
      username: username,
      password: password,
      email: email
    });
  }

  /**
   * Create and store new user.
   */
  function create_user() {
    return SumoDB.create_user().then(function(response) {
      var promises = [];

      var is_helper = false;
      promises.push(set_credentials(response.user.username, response.password,
        response.token, is_helper));

      promises.push(sync_user(response.user));

      return Promise.all(promises).then(function([credentials, user]) {
        return user;
      });
    });
  }

  function set_credentials(username, password, token, is_helper) {
    if (typeof is_helper == 'undefined') {
      console.error('foo');
      return;
    }
    return asyncStorage.setItem(USER_CREDENTIALS_KEY, {
      username: username,
      password: password,
      token: token,
      is_helper: is_helper
    });
  }

  function sync_user(user) {
    var normalized_user = normalize_user(user);
    normalized_user.last_sync = Date.now();
    if (window.parent.Notif) {
      window.parent.Notif.ensure_endpoint();
    }
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

    get_temporary_user: function() {
      return asyncStorage.getItem(TMP_USER_CREDENTIALS_KEY);
    },

    is_active: function(username) {
      return SumoDB.get_public_user(username).then(function(user) {
        return user.is_active;
      });
    },

    is_helper: function() {
      return User.get_credentials().then(function(credentials) {
        return credentials.is_helper;
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
        if (window.parent.Notif) {
          return window.parent.Notif.clear_endpoint().then(function() {
            return token;
          });
        } else {
          return token;
        }
      }).then(function(token) {
        var is_helper = true;
        return set_user(username, password, token, is_helper);
      });
    },

    authenticate_temporary_user: function() {
      return User.get_temporary_user().then(function(credentials) {
        var promise = User.authenticate_user(credentials.username,
          credentials.password);

        return promise.then(function(user) {
          asyncStorage.removeItem(TMP_USER_CREDENTIALS_KEY).then(function() {
            return user;
          });
        });
      });
    },

    register: function(username, password, email) {
      var promise = SumoDB.register_user(username, password, email);

      return promise.then(function() {
        return set_inactive_user(username, password, email);
      });
    }
  };
  exports.User = User;

})(window);
