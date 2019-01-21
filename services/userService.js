var rachioService = require("../services/rachioService");
var userRepository = require("../repositories/userRepository");
var dataCache = require("../utils/dataCache");
var Promise = require("promise");

let createUser = (req) => {
  return new Promise((resolve, reject) => {rachioService.getUserId(req.body.rachioOAuthToken)
    .then((resp) => {
      rachioService.getUserInfo(req.body.rachioOAuthToken, resp.id)
        .then((resp) => {
          let username = (req.body.isRachioAuthenticatedUser ? resp.username : req.body.username);
          userRepository.saveUser(username, req.body.password, req.body.rachioOAuthToken, req.body.rachioRefreshToken, req.body.rachioTokenExpirationDate, resp)
            .then((resp) => {
              console.log("post /api/user success - id " + resp.id + " added to User table ");
              dataCache.saveToCache(username, req.body.rachioOAuthToken, (response) => {  
                console.log("OAuth Token saved to cache");
                resolve({username: username});
              });
            }).catch(function (err) {
              console.log("Error returned from User.create() - could not complete insert request");
              console.log(err);
              reject(err);
            });
        });
    });
  });
};

module.exports.createUser = createUser;

