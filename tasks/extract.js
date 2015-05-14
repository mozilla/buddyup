var path = require('path');
var fs = require('fs');

var acorn = require('acorn');
var acornWalk = require('../node_modules/acorn/dist/walk');
var moment = require('moment');
var nunjucksParser = require('nunjucks').parser;
var nunjucksNodes = require('../node_modules/nunjucks/src/nodes');

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
  var extensionToExtractors = {
    '.html': extractNunjucks,
    '.js': extractJavasript,
  };

  grunt.registerMultiTask('extract', 'Extract strings for l10n', function() {
    this.files.map(function(file) {
      var stringSets = file.src.map(function(filepath) {
        var extension = path.extname(filepath)
        var extractor = extensionToExtractors[extension];

        if (extractor === undefined) {
          grunt.fail.fatal('No extraction method defined for extension ' + extension + ' (' + filepath + ')');
          return [];
        }

        return extractor(filepath);
      });

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
        ['_', '_plural', 'gettext', 'ngettext'].indexOf(node.name.value) !== -1
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
  }

  function extractJavasript(filepath) {
    return walk(parse(filepath))
    .filter(filterCalls)
    .map(makeString);

    function parse(filepath) {
      var contents = grunt.file.read(filepath);
      var ast = acorn.parse(contents, {
        locations: true,
        ecmaVersion: 6,
      });
      return ast;
    }

    function walk(ast) {
      var nodes = [];
      acornWalk.simple(ast, {
        CallExpression: function(node) {
          nodes.push(node);
        },
      });
      return nodes;
    }

    function filterCalls(callExpr) {
      return (
        callExpr.callee.type === 'Identifier' &&
        ['gettext', 'ngettext'].indexOf(callExpr.callee.name) != -1
      );
    }

    function makeString(callExpr) {
      var errorLocation = filepath + ':' + callExpr.loc.start.line;

      switch (callExpr.callee.name) {
        case 'gettext':
          if (callExpr.arguments.length < 1) {
            grunt.fail.warn('Empty gettext call at ' + errorLocation);
            return null;
          }

          if (callExpr.arguments[0].type !== 'Literal') {
            grunt.fail.warn('Cannot localize non-literal at ' + errorLocation);
            return null;
          }

          return {
            filepath: filepath,
            lineno: callExpr.loc.start.line,
            msgid: callExpr.arguments[0].value,
          };

        case 'nggettext':
          if (callExpr.arguments.length < 2) {
            grunt.fail.warn('Incomplete ngettext call at ' + errorLocation);
            return null;
          }

          if (callExpr.arguments[0].type !== 'Literal' ||
              callExpr.arguments[1].type !== 'Literal') {
            grunt.fail.warn('Cannot localize non-literal at ' + errorLocation);
            return null;
          }

          return {
            filepath: filepath,
            lineno: callExpr.loc.start.line,
            msgid: callExpr.arguments[0].value,
            msgid_plural: callExpr.arguments[1].value,
          };

        default:
          grunt.fail.warn('Unknown type of localization at ' + errorLocation);
          return null;
      }
    }
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
