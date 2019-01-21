var db = require("../models");
var userService = require("../services/userService");
var passport = require("passport");


module.exports = function (app) {
  // --------------------------------------------------------------------------
  // User Profile Routes
  //     GET    /api/user/:id   - return one user from the database
  //     PUT    /api/user/:id   - update a specfic user's field in the database
  //     DELETE /api/user/:id   - removes a specific user from the database
  //     POST   /api/user       - add a user to the dataase
  // --------------------------------------------------------------------------

  //--------------------
  // CREATE - POST("/api/user") - This API is not protected, as anyone can create a new account
  app.post("/api/user/",
    function (req, res) {
      userService.createUser(req).then(response => {
        res.redirect("/login");
      }).catch(function (err) {
        console.log("Error returned from User.create() - could not complete insert request");
        console.log(err);
        return res.status(500).end();
      });
    });

  //--------------------
  // READ - GET("/api/user/:id") - returns the specified user from the User table  
  //                             - requires authenticated user to access
  app.get("/api/user/:id",
    passport.authenticate("basic", {session: false}),
    function (req, res) {

      console.log("GET /api/user/:id called for id: " + req.params.id);

      db.User.findOne({
        where: {
          id: req.params.id
        }
      })
        .then(function (dbResult) {
          res.json(dbResult);
        })
        .catch(function (err) {
          console.log("Error returned from User.findOne() - could not complete search request");
          console.log(err);
          return res.status(500).end();
        });
    });

  //--------------------
  // UPDATE - PUT("/api/user/:id") - update the fields of the specified user
  //                               - requires authenticated user to access
  app.put("/api/user/:id",
    passport.authenticate("basic", {session: false}),
    function (req, res) {

      console.log("PUT /api/user/:id for id: ", req.params.id);
      db.User.update({
        userName: req.body.userName,
        password: req.body.password,
        rachioOAuthToken: req.body.rachioOAuthToken
      }, {
        where: {
          id: req.params.id
        }
      })
        .then(function (data) {
          var resData = {
            rowsAffected: data
          };
          console.log("update /api/user success - " + resData.rowsAffected + " rows affected");
          res.json(resData);
        })
        .catch(function (err) {
          console.log("Error returned from User.update() - could not complete the update request");
          console.log(err);
          return res.status(500).end();
        });
    });


  //--------------------
  // DELETE - DELETE("/api/user/:id") - delete the specified user from the User table
  //                                  - requires authenticated user to access
  app.delete("/api/user/:id",
    passport.authenticate("basic", {session: false}),
    function (req, res) {
      console.log("DELETE /api/user called on id: ", req.params.id);
      db.User.destroy({
        where: {
          id: req.params.id
        }
      })
        .then(function (data) {
          var resData = {
            rowsAffected: data
          };
          console.log("delete /api/user success - " + resData.rowsAffected + " rows affected");
          res.json(resData);
        })
        .catch(function (err) {
          console.log("Error returned from User.destroy() - could not complete delete request");
          console.log(err);
          return res.status(500).end();
        });
    });
};