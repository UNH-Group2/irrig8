require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;
var LocalStrategy = require("passport-local").Strategy;
const securityUtils = require("./utils/securityUtils");
var client = require("redis").createClient(process.env.REDIS_URL);
var dataCache = require("./utils/dataCache");

var db = require("./models");

// User BasicStrategy for API call (/api)
passport.use(new BasicStrategy(
  function(username, password, cb) {
    db.User.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password !== securityUtils.hashData(password)) { return cb(null, false); }
      return cb(null, user);
    });
  }));

// Use LocalStrategy for HTML calls (/html)
passport.use(new LocalStrategy(
  function(username, password, cb) {
    db.User.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password !== securityUtils.hashData(password)) { return cb(null, false); }
      return cb(null, user);
    });
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling. -- needed for Passport
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("express-session")({ secret: "bongo kitty", resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: require("./public/js/helpers.js").helpers, 
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/zoneRoutes")(app);
require("./routes/userRoutes")(app);
require("./routes/loginRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// connect to Redis and load OAuth tokens into cache
client.on("connect", ()=>{
  console.log("Node Environment: " + process.env.NODE_ENV);
  console.log("connected to Redis");
  dataCache.loadOAuthTokens();
});

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
