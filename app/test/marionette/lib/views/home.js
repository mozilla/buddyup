'use strict';

/* global require, module */

var _ = require('lodash');
var View = require('./view');
var Question = require('./question');

function Home() {
  View.apply(this, arguments);
}
module.exports = Home;

Home.prototype = {
  __proto__: View.prototype,

  openAskQuestion: function() {
    var self = this;
    self.client.findElement(self._SELECTORS.ASK_QUESTION_BUTTON).click();
    var question = new Question(self.client);
    return question.switchToFrame().then(function() {
      return question;
    });
  },

  _SELECTORS: _.merge({
    MAIN: 'iframe[src="home.html"]',
    ASK_QUESTION_BUTTON: 'a[href="question.html"]'
  }, View.prototype._SELECTORS)
};
