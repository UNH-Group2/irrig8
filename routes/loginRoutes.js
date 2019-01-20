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
  // "username" and "password" are required to be part of the passed req body
  app.post("/login",
    passport.authenticate("local", 
      { 
        failureRedirect: "/login"
      }),
    (req, res) =>{
      res.redirect(`/zones/${req.body.username}`);
    });

  //--------------------
  // GET ("/logout") - remove their authenticated id from session storage
  // redirects them to the home page
  app.get("/logout",
    function (req, res) {
      console.log("called endpoint - get /logout");
      req.logout();
      res.redirect("/");
    });
};