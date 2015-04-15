'use strict';

/* global module */

module.exports = {
  remoteInstallApp: function() {
    // This requires BuddyUp running with grunt
    return navigator.mozApps
      .installPackage('http://localhost:8000/app/manifest.webapp');
  }
};
