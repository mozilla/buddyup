'use strict';

/* global require, module */

var _ = require('lodash');
var View = require('./view');
var BUDDY_UP_ORIGIN = require('../buddyup').ORIGIN;

function Question() {
  View.apply(this, arguments);
}
module.exports = Question;

Question.prototype = {
  __proto__: View.prototype,

  _SELECTORS: _.merge({
    MAIN: 'iframe[src="' + BUDDY_UP_ORIGIN + '/question.html"]',
  }, View.prototype._SELECTORS)

};
