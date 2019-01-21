var passport = require("passport");
var userService = require("../services/userService");
var rachioService = require("../services/rachioService");

module.exports = function (app) {

  //--------------------------
  // PASSPORT - Login Routes -
  //--------------------------

  //--------------------
  // GET ("/login") - Rachio will redirect to this endpoint after authenticating user
  app.get("/login",
    function (req, res) {
      if(typeof req.query.code === "undefined") {
        res.render("index");
      }
      else{
        // the redirect from Rachio should go to a different endpoint 
        // (i.e. not GET /login) currently this endpoint is dual purpose, which isn't good.
        console.log("This is a redirect from Rachio");

        rachioService.getAccessToken(req.query.code).then(response => {
          let accessToken = response.access_token;
          let refreshToken = response.refresh_token;
          let expirationTime = response.expires_in;

          let request = {
            body: {
              rachioOAuthToken: accessToken,
              rachioRefreshToken: refreshToken,
              rachioTokenExpirationDate: expirationTime,
              password: "rachioAuthenticatedUser",
              isRachioAuthenticatedUser: true
            }
          };

          userService.createUser(request).then(response => {
            res.redirect(`/zones/${response.username}`);
          });
        });
      }
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

  app.post("/login/rachio",
    function (req, res) {
      rachioService.getAccessToken()
        .then(() => {
          res.redirect(`https://app.rach.io/oauth?clientId=${process.env.RACHIO_CLIENT_ID}`);
        });
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