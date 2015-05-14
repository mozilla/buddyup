var fs = require('fs');
var moment = require('moment');
var nunjucksParser = require('nunjucks').parser;
var nunjucksNodes = require('../node_modules/nunjucks/src/nodes');

var nowStr = '';
var now = new Date();
nowStr += now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
nowStr += ' ' + now.getHours() + ':' + now.getMinutes();
var offset = now.getTimezoneOffset() / -60;
var hoursOff = Math.floor(offset);
var minutesOff = Math.floor((offset - hoursOff) * 60);
nowStr += hoursOff + minutesOff;

var PO_HEADER = [
  'msgid ""',
  'msgstr ""',
  '"Project-Id-Version: PACKAGE VERSION\\n"',
  '"Report-Msgid-Bugs-To: \\n"',
  '"POT-Creation-Date: ' + moment().format('%yyyy-%mm-%d %I:%M%Z') + '\\n"',
  '"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"',
  '"Last-Translator: Automatically generated\\n"',
  '"Language-Team: none\\n"',
  '"Language: \\n"',
  '"MIME-Version: 1.0\\n"',
  '"Content-Type: text/plain; charset=UTF-8\\n"',
  '"Content-Transfer-Encoding: 8bit\\n"',
  '"X-Generator: Translate Toolkit 1.6.0\\n"',
  '"Plural-Forms: nplurals=2; plural=(n != 1);\\n"',
].join('\n') + '\n\n'


module.exports = function(grunt) {
  var extractors = {
    nunjucks: extractNunjucks,
  };

  grunt.registerMultiTask('extract', 'Extract strings for l10n', function() {
    var options = this.options({
      format: 'nunjucks',
    });

    var extractor = extractors[options.format];
    if (extractor === undefined) {
      grunt.fail.fatal('Unknown extract format ' + this.options.format);
    }

    this.files.map(function(file) {
      var stringSets = file.src.map(extractor);
      // flatten stringSets
      var extractedStrings = Array.prototype.concat.apply([], stringSets);
      writePotFile(extractedStrings, file.dest);
    })
  });

  function extractNunjucks(filepath) {
    var contents = grunt.file.read(filepath);
    var parseTree = nunjucksParser.parse(contents);

    return parseTree.findAll(nunjucksNodes.FunCall)
    .filter(function(node) {
      // Exclude functions calls that aren't to gettext.
      return (
        node.name &&
        node.name instanceof nunjucksNodes.Symbol &&
        (node.name.value === '_' || node.name.value === '_plural')
      );
    })
    .map(function(node) {
      var errorLocation = filepath + ':' + node.lineno;

      switch (node.name.value) {
        case '_':
          if (node.args.children.length < 1) {
            grunt.fail.warn('Empty gettext call at ' + errorLocation);
            return null;
          }

          var stringNode = node.args.children[0];
          if (!(stringNode instanceof nunjucksNodes.Literal)) {
            grunt.fail.warn('Cannot localize non-literal at ' + errorLocation);
            return null;
          }

          return {
            filepath: filepath,
            lineno: node.lineno,
            msgid: stringNode.value,
          };

        case '_plural':
          if (node.args.children.length < 3) {
            grunt.fail.warn('Incomplete plural gettext call at ' + errorLocation);
            return null;
          }
          var singularNode = node.args.children[0];
          var pluralNode = node.args.children[1];

          if (!(singularNode instanceof nunjucksNodes.Literal) ||
              !(pluralNode instanceof nunjucksNodes.Literal)) {
            grunt.fail.warn('Cannot localize non-literal at ' + errorLocation);
            return null;
          }

          return {
            filepath: filepath,
            lineno: node.lineno,
            msgid: singularNode.value,
            msgid_plural: pluralNode.value,
          };

        default:
          grunt.fail.warn('Unknown type of localization at ' + errorLocation);
          return null;
      }
    })
    .filter(function(string) {
      return string !== null;
    });

    // TODO: parse.
    // https://github.com/mozilla/commonplace/blob/master/lib/commonplace.js
    // https://github.com/mozilla/commonplace/blob/master/lib/extract_l10n.js
  }

  function writePotFile(strings, destpath) {
    var poFragments = strings.map(function(string) {
      var parts = [
        '#: ' + string.filepath + ':' + string.lineno,
        'msgid "' + string.msgid + '"',
      ];
      if (string.msgid_plural) {
        parts = parts.concat([
          'msgid_plural: "' + string.msgid_plural + '"',
          'msgstr[0] ""',
          'msgstr[1] ""',
        ]);
      } else {
        parts.push('msgstr ""');
      }

      return parts.join('\n');
    });

    grunt.file.write(destpath, PO_HEADER + poFragments.join('\n\n'));
  }
};
