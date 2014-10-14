var inlineTemplateCompiler = require('./index');

module.exports = {
  name: 'broccoli-ember-inline-template-compiler',
  included: function(app) {
    this._super.included.apply(this, arguments);

    app.registry.add('js', {
      name: 'broccoli-ember-inline-template-compiler',
      ext: 'js',
      toTree: function(tree) {
        return inlineTemplateCompiler(tree);
      }
    });
  }
};
