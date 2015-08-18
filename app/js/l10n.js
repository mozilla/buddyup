'use strict';

(function() {
  function format(string, formatKwargs) {
    if (formatKwargs === undefined) {
      return string;
    }

    return string.replace(/{[^}]+}/g, function(input) {
      var name = input.slice(1, -1);
      return formatKwargs[name];
    });
  }

  // A no-op set of localization in case real localization fails.

  function _getTranslation(msgId) {
    return msgId;
  }

  function _getPluralTranslation(singular, plural, count) {
    if (count === 1) {
      return singular;
    } else {
      return plural;
    }
  }

  function gettext(string, formatKwargs) {
    return format(window._getTranslation(string), formatKwargs);
  }

  function ngettext(singular, plural, formatKwargs) {
    if (!('n' in formatKwargs)) {
      throw 'nggettext calls must have a kwarg "n" for arity.';
    }
    return format(window._getPluralTranslation(singular, plural, formatKwargs.n), formatKwargs);
  }

  if (window.gettext) {
    // Localization loaded, use that.
    window._getTranslation = window.gettext;
    window._getPluralTranslation = window.ngettext;
  } else {
    // No localization loaded. Fake it.
    window._getTranslation = _getTranslation;
    window._getPluralTranslation = _getPluralTranslation;
  }

  // Use our own versions of gettext and ngettext, for nice formatting.
  window.gettext = gettext;
  window.ngettext = ngettext;

  window.nunjucksEnv.addGlobal('_', window.gettext);
  window.nunjucksEnv.addGlobal('_plural', window.ngettext);
})();
