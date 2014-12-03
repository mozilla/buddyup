'use strict';

/**
 * Basic placeholder and first steps. This will need to be expanded
 * for l10n and other uses in the app among other things.
 */
(function(exports) {
  var dialog = document.querySelector('#first_question_help');
  var closeButton = dialog.querySelector('#confirm');

  closeButton.addEventListener('click', function(evt) {
      evt.preventDefault();
      dialog.classList.add('hide');
  });
})(window);
