var passport = require("passport");

module.exports = function (app) {

  //--------------------------
  // PASSPORT - Login Routes -
  //--------------------------

  //--------------------
  // GET ("/login") - does nothing but redirect them to the actual login page
  app.get("/login",
    function (req, res) {
      console.log("called endpoint - get /login, send them to login page (for post)");
      res.render("index");
    });

  //--------------------
  // POST ("/login") - authenticates their username & password via Passport
  //                 - "username" and "password" are required to be part of the passed req body
  app.post("/login",
    passport.authenticate("local", {
      failureRedirect: "/login"
    }),
    function (req, res) {
      console.log("called endpoint - post /login");
      res.render("zones", {
        user: req.user
      }); // success! send them to a landing page
    });

  //--------------------
  // GET ("/logout") - remove their authenticated id from session storage
  //                 - redirects them to the home page
  app.get("/logout",
    function (req, res) {
      console.log("called endpoint - get /logout");
      req.logout();
      res.redirect("/");
    });

  //--------------------
  // GET ("/profile") - redirect to a profile page
  //                  - supplies the authenticated user id in the body
  app.get("/profile",
    require("connect-ensure-login").ensureLoggedIn(),
    function (req, res) {
      console.log("called endpoint - get /profile"),
      res.render("profile", {
        user: req.user
      });
    });

  //--------------------
  // GET ("/register") - redirect to a profile page for an unauthenticated user
  app.get("/register",
    function (req, res) {
      console.log("called endpoint - get /register"),
      res.render("profile");
    });

};