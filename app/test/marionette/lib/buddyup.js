'use strict';

/* global require, module */

function BuddyUp(client) {
  this.client = client.scope({
    searchTimeout: 5000
  });
}

BuddyUp.ORIGIN = 'app://buddyup.gaiamobile.org';

module.exports = BuddyUp;

var Promise = require('es6-promise').Promise;
var remoteInstallApp = require('./remote_calls').remoteInstallApp;
var Home = require('./views/home');

BuddyUp.prototype = {
  launch: function() {
    var client = this.client;
    return _installAppIfNeeded(client)
    .then(_launch)
    .then(_initHomeView);
  }
};


function _installAppIfNeeded(client) {
  return new Promise(function(resolve, reject) {
    client.executeJsScript(remoteInstallApp, function(err, value) {
      // TODO Check the error once bug 1155639 lands
      // if (err) { reject(err) }
      resolve(client);
    });
  });
}

function _launch(client) {
  return new Promise(function(resolve, reject) {
    client.apps.launch(BuddyUp.ORIGIN);
    resolve(client);
  });
}

function _initHomeView(client) {
  return new Promise(function(resolve, reject) {
    var home = new Home(client);
    home.switchToFrame();
    resolve(home);
  });
}
