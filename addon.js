var inlineTemplateCompiler = require('./index');

module.exports = {
  name: 'ember-cli-inline-template-compiler',
  included: function(app) {
    this._super.included.apply(this, arguments);

    app.registry.add('js', {
      name: 'ember-cli-inline-template-compiler',
      ext: 'js',
      toTree: function(tree) {
        return inlineTemplateCompiler(tree);
      }
    });
  }
};
