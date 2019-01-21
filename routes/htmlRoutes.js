var zoneRepository = require("../repositories/zoneRepository");

module.exports = function (app) {

  // Load index page
  app.get("/", function (req, res) {
    res.render("index");
  });

  // Load zone page
  app.get("/zones/:username",
    //require("connect-ensure-login").ensureLoggedIn(),
    function (req, res) {
      zoneRepository.getZones(req.params.username).then((resp) => {
        res.render("zones", {
          layout: "zone",
          user: resp
        });
      });
    });

  app.get("/register", function (req, res) {
    res.render("profile");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });

};
