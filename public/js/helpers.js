// Helper.js - registers custom helper tags for handlebars
var register = function (Handlebars) {
  var helpers = {

    // Test functions to prove 
    foo: function () {
      return "FOO";
    },
    bar: function () {
      return "BAR";
    },

    // __sections:  Allows for a section to be added to the header of each view

    // Layout file syntax example: 
    //   <head>
    //     {{{_sections.head}}}                 <-----<<
    //   </head>
    //   <body>
    //     {{{body}}}
    //   </body>

    // Views file syntax example: 
    //     {{#section 'head'}}                  <-------<<
    //       <!-- stuff that goes in head...example: -->
    //       <meta name="robots" content="noindex">
    //    {{/section}}
    section: function (name, options) {
      if (!this._sections) {
        this._sections = {};
      }
      this._sections[name] = options.fn(this);
      return null;
    }
  };

  // Utility to register helpers with express
  if (Handlebars && typeof Handlebars.registerHelper === "function") {

    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    // just return helpers object if we can't register helpers here
    return helpers;
  }

};

module.exports.register = register;
module.exports.helpers = register(null);