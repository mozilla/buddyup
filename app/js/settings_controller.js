'use strict';

/* global SumoDB, nunjucks  */

(function(exports) {
  var SettingsController = {
    init: function() {
      SumoDB.get_settings().then(function(response) {

        var html = nunjucks.render('my-settings.html', {
          results: {}
        });

        document.querySelector('#my-settings').innerHTML= html;
      });
    }
  };

  exports.SettingsController = SettingsController;
  SettingsController.init();

})(window);
