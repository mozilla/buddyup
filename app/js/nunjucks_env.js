'use strict';

/* global nunjucks */

(function() {
  var loader = new nunjucks.WebLoader('/views');
  window.nunjucksEnv = new nunjucks.Environment(loader, {autoescape: true});
})();
