'use strict';

/* global Navigation, User, Utils */

(function(exports) {
  var LaunchChecks = {
    init: function() {
      var gecko = parseInt(Utils.get_gecko_version(), 10);
      if (gecko < 32) {
        Navigation.go_to_view('old_versions.html');
        return;
      }

      User.get_temporary_user().then(function(user) {
        if (user) {
          Navigation.go_to_view('email_confirmation.html');
        }
      });
    }
  };

  exports.LaunchChecks = LaunchChecks;
  // Navigation will call init()
})(window);
