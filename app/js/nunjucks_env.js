'use strict';

/* global nunjucks */

(function(exports) {
  var loader = new nunjucks.WebLoader('/views');

  var nunjucksEnv = new nunjucks.Environment(loader, {autoescape: true});

  exports.nunjucksEnv = nunjucksEnv;
})(window);
