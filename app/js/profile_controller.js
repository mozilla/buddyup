'use strict';

/* global SumoDB, User, nunjucks  */

(function(exports) {

  var LOCALES = ['en-US', 'fr', 'de'];
  var HANDSETS = ['Alcatel', 'Flame'];
  var OPERATORS = ['Movistar', 'MTN'];

  /**
   * Get the list of selected handset types from the form element and returns
   * them as an array.
   * @param {array} selected_options - The selected handset types
   * @returns {array} Selected handset types as an array
   */
  function get_selected_handset_types(selected_options) {
    var handset_types = [];
    for (var i = 0, l = selected_options.length; i < l; i++) {
      handset_types.push(selected_options[i].value);
    }
    return handset_types;
  }

  /**
   * Collect information from the profile form on submission and
   * submits new data to server.
   */
  function update_user(evt) {
    evt.preventDefault();

    var user = {};
    var settings = [];
    var form = document.getElementById('profile');
    var profile_elements = ['display_name', 'new_comment_notify',
      'buddyup_reminder', 'locale', 'handset_type', 'operator'];

    for (var i = 0, l = profile_elements.length; i < l; i++) {
      var elem_name = profile_elements[i];
      var elem = form.elements[profile_elements[i]];

      switch(elem_name) {
        case 'handset_type':
          user[elem_name] = get_selected_handset_types(elem.selectedOptions);
          break;
        case 'new_comment_notify':
        case 'buddyup_reminder':
          settings.push({
            'name': elem_name,
            'value': elem.checked
          });
          break;
        default:
          user[elem_name] = elem.value;
      }
    }

    var user_data = {
      user: user,
      settings: settings
    };
    // update the user details on the server
    SumoDB.update_user(user_data).then(function(response) {
      // now update local user data
      console.log(response);
      User.update_user(response);
    });
  }

  /**
   * Register the event handler for the profile form.
   */
  function register_form() {
    var profile = document.getElementById('profile');
    profile.addEventListener('submit', update_user);
  }

  var ProfileController = {
    init: function() {

      User.get_user().then(function(user) {
        var html = nunjucks.render('my-profile.html', {
          results: {
            user: user,
            locales: LOCALES,
            handsets: HANDSETS,
            operators: OPERATORS
          }
        });

        document.querySelector('#my-profile').innerHTML = html;
        register_form();
      });
    }
  };

  exports.ProfileController = ProfileController;
  ProfileController.init();

})(window);
