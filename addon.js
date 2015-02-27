var inlineTemplateCompiler = require('./index');
var path = require('path');
// for ember-cli always use the bower version of the ember template compiler
var compiler = require(path.join(process.cwd(),'./bower_components/ember/ember-template-compiler.js'));

module.exports = {
  name: 'broccoli-ember-inline-template-compiler',
  included: function(app) {
    this._super.included.apply(this, arguments);

    app.registry.add('js', {
      name: 'broccoli-ember-inline-template-compiler',
      ext: 'js',
      toTree: function(tree) {
        return inlineTemplateCompiler(tree, { 
          compiler: compiler
        });
      }
    });
  }
};
