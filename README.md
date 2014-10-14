# Broccoli Ember Inline Template Compiler

Broccoli plugin that precompiles inline Handlebars templates so that libraries or applications can be packaged with Handlebars Runtime only instead of the full library.

## Documentation

### `inlineTemplateCompiler(inputTree)`

`inputTree` *{Single Tree}*

Input is a single tree.

### Usage

In order for Broccoli Ember Inline Template Compiler to pickup inline templates, they must be assigned to a local variable called `precompileTemplate`

Example:

```
  // instead of
  var template = Ember.Handlebars.compile("...");

  // do
  var precompileTemplate = Ember.Handlebars.compile;
  var template = precompileTemplate("...");
```

### Installation (as Broccoli plugin)

`npm install --save-dev broccoli-ember-inline-template-compiler`

And then in your `Brocfile.js`:

```
var inlineTemplateCompiler = require('broccoli-ember-inline-template-compiler');

tree = inlineTemplateCompiler(tree);
```

### Installation (as ember-cli addon)

`npm install --save-dev broccoli-ember-inline-template-compiler`

No changes to your `Brocfile.js`

### Credits

Extracted from https://github.com/emberjs/ember.js/blob/master/lib/broccoli-ember-inline-template-precompiler.js. Authored by [@rwjblue](https://github.com/rwjblue), [@fivetanley](https://github.com/fivetanley), and [@concreted](https://github.com/concreted).

## License

This project is distributed under the MIT license.
