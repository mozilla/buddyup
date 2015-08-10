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

    var ignorePatterns = [/^\./, /^en_US$/, /^compendia$/, /^templates$/];
    var locales = fs.readdirSync('locale')
    .filter(function(name) {
      var stat = fs.statSync(path.join('locale', name));
      // is a directory, and it matches none of the ignore patterns.
      if (!stat.isDirectory()) {
        return false;
      }
      for (var i = 0; i < ignorePatterns.length; i++) {
        if (ignorePatterns[i].exec(name)) {
          return false;
        }
      }
      return true;
    })
    .map(function(name) {
      return name.replace('_', '-');
    });

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
