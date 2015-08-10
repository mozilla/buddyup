'use strict';

/* global _, asyncStorage, Navigation, Settings, User, Utils */

(function(exports) {
  var LaunchChecks = {
    init: function() {
      asyncStorage.getItem('has_launched').then(function(launched) {
        var supported_locale = _.find(Settings.LOCALES, function(locale) {
          return locale[0] == navigator.language;
        });

        if (!launched && !supported_locale) {
          Navigation.go_to_view('unsupported_locale.html');
          return;
        }

        // asyncStorage.setItem('has_launched', true);

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
      });
    }
  };

  exports.LaunchChecks = LaunchChecks;
  // Navigation will call init()
})(window);
