/*jshint node: true */
var fs = require('fs');
var Filter = require('broccoli-filter');

function EmberInlineTemplatePrecompiler (inputTree, options) {
  if (!(this instanceof EmberInlineTemplatePrecompiler)) {
    return new EmberInlineTemplatePrecompiler(inputTree, options);
  }

  this.options = options || {};
  this.inputTree = inputTree;
  this.compiler = this.options.compiler;

  this.inlineTemplateRegExp = /precompileTemplate\(['"](.*)['"]\)/;
  // Used for replacing the original variable declaration to satisfy JSHint.
  // For example, removes `var precompileTemplate = Ember.Handlebars.compile;`.
  this.precompileTemplateVarRegex = /var precompileTemplate =.*\r?\n/g;
}

EmberInlineTemplatePrecompiler.prototype = Object.create(Filter.prototype);
EmberInlineTemplatePrecompiler.prototype.constructor = EmberInlineTemplatePrecompiler;
EmberInlineTemplatePrecompiler.prototype.extensions = ['js'];
EmberInlineTemplatePrecompiler.prototype.targetExtension = 'js';

EmberInlineTemplatePrecompiler.prototype.processFile = function (srcDir, destDir, relativePath) {
  var self = this;

  var inputString = fs.readFileSync(srcDir + '/' + relativePath, { encoding: 'utf8' });
  var outputPath = this.getDestFilePath(relativePath);
  var outputString = processTemplates().replace(this.precompileTemplateVarRegex, '');

  fs.writeFileSync(destDir + '/' + outputPath, outputString, { encoding: 'utf8' });

  function processTemplates() {
    var nextIndex;
    getNextIndex();

    while (nextIndex > -1) {
      var match = inputString.match(self.inlineTemplateRegExp);
      var template = "Ember.HTMLBars.template(" + self.compiler.precompile(match[1], false) + ")";

      inputString = inputString.replace(match[0], template);

      getNextIndex();
    }

    function getNextIndex() {
      nextIndex = inputString.search(self.inlineTemplateRegExp);
    }

    return inputString;
  }
};

module.exports = EmberInlineTemplatePrecompiler;

