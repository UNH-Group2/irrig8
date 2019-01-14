var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbExample) {
      res.json(dbExample);
    });
  });


  // --------------------------------------------------------------------------
  // User Profile Routes
  //     GET    /api/user/:id   - return one user from the database
  //     PUT    /api/user/:id   - update a specfic user's field in the database
  //     DELETE /api/user/:id   - removes a specific user from the database
  //     POST   /api/user       - add a user to the dataase
  // --------------------------------------------------------------------------

  //--------------------
  // CREATE - POST("/api/user") - add a new User to the user table, returns new user id 
  app.post("/api/user/", function (req, res) {

    console.log("post /api/user called");

    db.User.create({
      userName: req.body.userName,
      password: req.body.password,
      rachioOAuthToken: req.body.rachioOAuthToken
    })
      .then(function (userData) {
        console.log("post /api/user success - id " + userData.id + " added to User table ");
        return res.json({
          id: userData.id
        });

      }).catch(function (err) {
        console.log("Error returned from User.create() - could not complete insert request");
        console.log(err);
        return res.status(500).end();
      });
  });

  //--------------------
  // READ - GET("/api/user/:id") - returns the specified user from the User table  
  app.get("/api/user/:id", function (req, res) {

    console.log("GET /api/user/:id called for id: " + req.params.id);
   
    db.User.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(function (dbResult) {
        res.json(dbResult);
      })
      .catch(function(err) {
        console.log("Error returned from User.findOne() - could not complete search request");
        console.log(err);
        return res.status(500).end();
      });
  });

  //--------------------
  // UPDATE - PUT("/api/user/:id") - update the fields of the specified user
  app.put("/api/user/:id", function(req, res) {

    console.log("PUT /api/user/:id for id: ", req.params.id);
    db.User.update({
      userName: req.body.userName,
      password: req.body.password,
      rachioOAuthToken : req.body.rachioOAuthToken
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
      .catch(function(err) {
        console.log("Error returned from User.update() - could not complete the update request");
        console.log(err);
        return res.status(500).end();
      });
  });


  //--------------------
  // DELETE - DELETE("/api/user/:id") - delete the specified user from the User table
  app.delete("/api/user/:id", function (req, res) {
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