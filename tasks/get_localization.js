/* eslint-env node */
var path = require('path');
var fs = require('fs');
var httpRequest = require('http-request');

var acorn = require('acorn');
var acornWalk = require('../node_modules/acorn/dist/walk');
var moment = require('moment');
var nunjucksParser = require('nunjucks').parser;
var nunjucksNodes = require('../node_modules/nunjucks/src/nodes');


module.exports = function(grunt) {
  grunt.registerTask('get_localization', 'Get strings from SUMO for localization', function() {
    var done = this.async();
    var urlTemplate = 'https://support.mozilla.org/{locale}/jsi18n-buddyup/';
    var baseDestination = path.join('.', 'app', 'translations');

    try {
      fs.mkdirSync(baseDestination);
    } catch(e) {
      // if the directory already exists, fine. Otherwise, re-throw.
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }

    var locales = [
      "af", "ak", "ar", "as", "ast", "az", "bg", "bn-BD", "bn-IN", "bs",
      "ca", "cs", "da", "de", "dsb", "ee", "el", "eo", "es", "et", "eu",
      "fa", "ff", "fi", "fr", "fur", "fy-NL", "ga", "ga-IE", "gd", "gl",
      "gu-IN", "ha", "he", "hi-IN", "hr", "hsb", "hu", "hy-AM", "id",
      "ig", "is", "it", "ja", "kk", "km", "kn", "ko", "ln", "lt", "mk",
      "ml", "mn", "mr", "ms", "my", "nb-NO", "nl", "no", "oc", "pa-IN",
      "pl", "pt-BR", "pt-PT", "rm", "ro", "ru", "rw", "sah", "si", "sk",
      "sl", "sq", "sr-Cyrl", "sr-LATN", "sv", "sv-SE", "sw", "ta",
      "ta-LK", "te", "th", "tr", "uk", "vi", "wo", "xh", "xx-testing",
      "yo", "zh-CN", "zh-TW", "zu",
    ];

    var count = 0;

    locales.forEach(function(locale) {
      var url = urlTemplate.replace('{locale}', locale);
      var dest = path.join(baseDestination, locale + '.js');
      // Download the file.
      httpRequest.get(url, dest, function(err) {
        if (err) {
          grunt.log.warn('Could not download localization for locale "' + locale + '". (' + url + ')');
        }
        count++;
        if (count >= locales.length) {
          done();
        }
      });
    });
  });
};
