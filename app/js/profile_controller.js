'use strict';

/* global SumoDB, UserController, nunjucks  */

(function(exports) {

  var LOCALES = ['en-US', 'fr', 'de'];
  var HANDSETS = ['Alcatel', 'Flame'];
  var OPERATORS = ['Movistar', 'MTN'];

  /**
   * Collect information from the profile form on submission and
   * submits new data to server.
   */
  function update_user(evt) {
    evt.preventDefault();

    var user_data = {};
    var form = document.getElementById('profile');
    var profile_elements = ['display_name', 'new_comments', 'new_questions',
      'locale', 'handset_type', 'operator'];

    for (var i = 0, l = profile_elements.length; i < l; i++) {
      var elem_name = profile_elements[i];
      var elem = form.elements[profile_elements[i]];

      user_data[elem_name] = elem.type === 'checkbox' ?
        elem.checked : elem.value;
    }
    SumoDB.update_user(user_data).then(function(response) {
      console.log(response);
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

      UserController.init().then(function(response) {
        // store the user in exports (window) or pass it around?
        exports.user = response;

        var html = nunjucks.render('my-profile.html', {
          results: {
            user: response,
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
