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

  /** A no-op translation until real localization is implemented. */
  function _getTranslation(msgId) {
    return msgId;
  }

  function gettext(string, formatKwargs) {
    return format(window._getTranslation(string), formatKwargs);
  }

  function ngettext(singular, plural, formatKwargs) {
    if (!('n' in formatKwargs)) {
      throw "nggettext calls must have a kwarg 'n' for arity."
    }
    var string;
    if (formatKwargs.n === 1) {
      string = singular;
    } else {
      string = plural;
    }
    return gettext(string, formatKwargs);
  }

  window.gettext = gettext;
  window.ngettext = ngettext;
  window._getTranslation = _getTranslation;

  window.nunjucksEnv.addGlobal('_', window.gettext);
  window.nunjucksEnv.addGlobal('_plural', window.ngettext);
})();
