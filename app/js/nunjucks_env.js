'use strict';

/* global gettext, nunjucks */

(function(exports) {
  var loader = new nunjucks.WebLoader('/views');

  var nunjucksEnv = new nunjucks.Environment(loader, {autoescape: true});
  nunjucksEnv.addGlobal('_', gettext);

  exports.nunjucksEnv = nunjucksEnv;
})(window);
