'use strict';

/* global require, module */

var Promise = require('es6-promise').Promise;
var Marionette = require('marionette-client');
var BUDDY_UP_ORIGIN = require('../buddyup').ORIGIN;

function View(client) {
  this.client = client.scope({
    searchTimeout: 5000
  });
  this.actions = new Marionette.Actions(client);
}
module.exports = View;


View.prototype = {
  get pageTitle() {
    return this.client.findElement(this._SELECTORS.PAGE_TITLE).text();
  },

  switchToFrame: function() {
    return _switchToInternalFrame(this.client, this._SELECTORS.MAIN);
  },

  _SELECTORS: {
    PAGE_TITLE: 'header h1'
  }
};


function _switchToInternalFrame(client, frameLocator) {
  // To switch to a sibling frame, we need to go back to the Gaia system
  // then to the app iframe and then to the frame we want
  return new Promise(function(resolve, reject) {
    client.switchToFrame(function() {
      client.apps.switchToApp(BUDDY_UP_ORIGIN);
      client.findElement(frameLocator, function(err, element) {
        if (err) {
          reject(err);
          return;
        }
        client.waitFor(function() {
          element.displayed();
          client.switchToFrame(element, resolve);
        });
      });
    });
  });
}
