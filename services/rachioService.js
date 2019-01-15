var rp = require("request-promise");

/**
 * Pulls rachioUserId and OAuth2 token from cache
 */
var getUserId = function (token) {
  var options = {
    uri: "https://api.rach.io/1/public/person/info",
    headers: {
      "User-Agent": "Request-Promise"
    },
    auth: {
      // we will pull this from redis cache based on userName;
      "bearer": token
    },
    json: true // Automatically parses the JSON string in the response
  };

  return rp.get(options)
    .then((resp) => {
      console.log(resp);
      return resp;
    })
    .catch((err) => { 
      console.log(err);
      return err;
    });
};

var getUserInfo = function (token, id) {
  var options = {
    uri: `https://api.rach.io/1/public/person/${id}`,
    headers: {
      "User-Agent": "Request-Promise"
    },
    auth: {
      // we will pull this from redis cache based on userName;
      "bearer": token
    },
    json: true // Automatically parses the JSON string in the response
  };

  return rp.get(options)
    .then((resp) => {
      return resp;
    })
    .catch((err) => { 
      console.log(err);
      return err;
    });
};

var turnOnZone = function (zoneId) {
  console.log(zoneId);
  var options = {
    uri: "https://api.rach.io/1/public/zone/start",
    method: "PUT",
    headers: {
      "User-Agent": "Request-Promise"
    },
    auth: {
      // we will pull this from redis cache based on userName;
      "bearer": "248886e0-f2c7-4206-9538-223153139ca4"
    },
    body: {
      id: zoneId,
      duration: 3660
    },
    json: true // Automatically parses the JSON string in the response
  };

  return rp.put(options)
    .then((resp) => {
      return resp;
    })
    .catch((err) => { 
      console.log(err);
      return err;
    });
};

var turnOffZone = function (deviceId) {
  var options = {
    uri: "https://api.rach.io/1/public/device/stop_water",
    method: "PUT",
    headers: {
      "User-Agent": "Request-Promise"
    },
    auth: {
      // we will pull this from redis cache based on userName;
      "bearer": "248886e0-f2c7-4206-9538-223153139ca4"
    },
    body: {
      id: deviceId,
    },
    json: true // Automatically parses the JSON string in the response
  };

  return rp.put(options)
    .then((resp) => {
      return resp;
    })
    .catch((err) => { 
      console.log(err);
      return err;
    });
};

module.exports.getUserId = getUserId;
module.exports.getUserInfo = getUserInfo;
module.exports.turnOnZone = turnOnZone;
module.exports.turnOffZone = turnOffZone;