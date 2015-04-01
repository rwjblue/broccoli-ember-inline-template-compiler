/*jshint node: true */
var fs = require('fs');
var Filter = require('broccoli-filter');

module.exports = EmberInlineTemplatePrecompiler;
EmberInlineTemplatePrecompiler.prototype = Object.create(Filter.prototype);
EmberInlineTemplatePrecompiler.prototype.constructor = EmberInlineTemplatePrecompiler;
function EmberInlineTemplatePrecompiler (inputTree, options) {
  if (!(this instanceof EmberInlineTemplatePrecompiler)) return new EmberInlineTemplatePrecompiler(inputTree, options);

  this.inputTree = inputTree;
  this.compiler = options && options.compiler || require('ember-template-compiler');
  this.inlineTemplateRegExp = /precompileTemplate\(['"](.*)['"]\)/;
  // Used for replacing the original variable declaration to satisfy JSHint.
  // For example, removes `var precompileTemplate = Ember.Handlebars.compile;`.
  this.precompileTemplateVarRegex = /var precompileTemplate =(.*\r?\n)/g;
}

EmberInlineTemplatePrecompiler.prototype.extensions = ['js'];
EmberInlineTemplatePrecompiler.prototype.targetExtension = 'js';

EmberInlineTemplatePrecompiler.prototype.processFile = function (srcDir, destDir, relativePath) {
  var self = this;

  var inputString = fs.readFileSync(srcDir + '/' + relativePath, { encoding: 'utf8' });
  var outputPath = this.getDestFilePath(relativePath);

  var matches = this.precompileTemplateVarRegex.exec(inputString);
  var templateFn = matches && ~matches[1].indexOf('Handlebars') ? "Ember.Handlebars.template" : "Ember.HTMLBars.template";

  var outputString = processTemplates(templateFn).replace(this.precompileTemplateVarRegex, '');

  fs.writeFileSync(destDir + '/' + outputPath, outputString, { encoding: 'utf8' });

  function processTemplates(templateFn) {
    var nextIndex;
    getNextIndex();

    while (nextIndex > -1) {
      var match = inputString.match(self.inlineTemplateRegExp);
      var template = templateFn + "(" + self.compiler.precompile(match[1], false) + ")";

      inputString = inputString.replace(match[0], template);

      getNextIndex();
    }

    function getNextIndex() {
      nextIndex = inputString.search(self.inlineTemplateRegExp);
    }

    return inputString;
  }
};
