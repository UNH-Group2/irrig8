const db = require("../models");
const securityUtils = require("../utils/securityUtils");

let saveUser = (userName, password, token, refreshToken, tokenEpirationDate, userInfo) => {

  let device = {};
  if (userInfo.devices[0] !== undefined) {
    device.name = userInfo.devices[0].name;
    device.timeZone = userInfo.devices[0].timeZone;
    device.serialNumber = userInfo.devices[0].serialNumber;
    device.macAddress = userInfo.devices[0].macAddress;
    device.locationLatitude = userInfo.devices[0].latitude;
    device.locationLongitude = userInfo.devices[0].longitude;
    device.rachioDeviceId = userInfo.devices[0].id;
    device.Zones = userInfo.devices[0].zones.filter(zone => {
      return zone.enabled;
    }).map((zone) => {
      return {
        zoneName: zone.name,
        zoneNumber: zone.zoneNumber,
        rachioZoneId: zone.id,
        imageURL: zone.imageUrl
      };
    });
  } else {
    device.name = "No Devices";
    device.timeZone = "";
    device.serialNumber = "";
    device.macAddress = "";
    device.locationLatitude = 0.0;
    device.locationLongitude = 0.0;
    device.rachioDeviceId = "1";
    device.Zones = [{
      zoneName: "No Zones Available",
      zoneNumber: "1",
      rachioZoneId: "1",
      imageURL: "https://prod-media-photo.rach.io/138e03c6-d055-4acc-bf4b-356baeca427f"
    }];
  }

  let user = {
    userName: userName,
    password: securityUtils.hashData(password),
    rachioOAuthToken: token,
    rachioRefreshToken: refreshToken,
    rachioUserId: userInfo.id,
    email: userInfo.email,
    fullName: userInfo.fullName,
    Devices: [{
      name: device.name,
      timeZone: device.timeZone,
      serialNumber: device.serialNumber,
      macAddress: device.macAddress,
      locationLatitude: device.latitude,
      locationLongitude: device.longitude,
      rachioDeviceId: device.id,
      Zones: device.Zones
    }]
  };

  return db.User.create(user, {
    include: [{
      model: db.Device,
      include: [db.Zone]
    }]
  });
};

let doesUserExist = (username) => {
  return db.User.count({ where: { userName: username } })
    .then(count => {
      if (count > 0) {
        return true;
      }
      return false;
    });
};

let getUser = (username) => {
  return db.User.findOne({
    where: {
      userName: username
    }
  });
};

let getOAuthTokens = () =>{
  return db.User.findAll({
    raw: true,
    attributes: ["userName", "rachioOAuthToken"]
  });
};

module.exports.saveUser = saveUser;
module.exports.getOAuthTokens = getOAuthTokens;
module.exports.getUser = getUser;
module.exports.doesUserExist = doesUserExist;