var db = require("../models");
var rachioService = require("../services/rachioService");
var userRepository = require("../repositories/userRepository");

module.exports = function (app) {
  // --------------------------------------------------------------------------
  // User Profile Routes
  //     GET    /api/user/:id   - return one user from the database
  //     PUT    /api/user/:id   - update a specfic user's field in the database
  //     DELETE /api/user/:id   - removes a specific user from the database
  //     POST   /api/user       - add a user to the dataase
  // --------------------------------------------------------------------------

  //--------------------
  // CREATE - POST("/api/user") - add a new User to the user table, returns new user id 
  //                            - requires authenticated user to access
  app.post("/api/user/",
    function (req, res) {

      console.log("post /api/user called");

      rachioService.getUserId(req.body.rachioOAuthToken)
        .then((resp) => {
          rachioService.getUserInfo(req.body.rachioOAuthToken, resp.id)
            .then((resp) => {
              userRepository.saveUser(req.body.userName, req.body.password, req.body.rachioOAuthToken, resp)
                .then((resp) => {
                  console.log("post /api/user success - id " + resp.id + " added to User table ");
                  // should send back the zone page with everything populated
                  return res.json({
                    id: resp.id
                  });
                }).catch(function (err) {
                  console.log("Error returned from User.create() - could not complete insert request");
                  console.log(err);
                  return res.status(500).end();
                });
            });
        });
    });

  //--------------------
  // READ - GET("/api/user/:id") - returns the specified user from the User table  
  //                             - requires authenticated user to access
  app.get("/api/user/:id",
    require("connect-ensure-login").ensureLoggedIn(),
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
    require("connect-ensure-login").ensureLoggedIn(),
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
    require("connect-ensure-login").ensureLoggedIn(),
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