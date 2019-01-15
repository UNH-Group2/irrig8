var db = require("../models");

let saveUser = (userName, password, token, userInfo) => {
  let user = {
    userName: userName,
    password: password,
    rachioOAuthToken: token,
    rachioUserId: userInfo.id,
    email: userInfo.email,
    fullName: userInfo.fullName,
    Devices: [{
      name: userInfo.devices[0].name,
      timeZone: userInfo.devices[0].timeZone,
      serialNumber: userInfo.devices[0].serialNumber,
      macAddress: userInfo.devices[0].macAddress,
      locationLatitude: userInfo.devices[0].latitude,
      locationLongitude: userInfo.devices[0].longitude,
      rachioDeviceId: userInfo.devices[0].id,
      Zones: userInfo.devices[0].zones.filter(zone =>{
        return zone.enabled;
      }).map((zone)=>{
        return { 
          zoneName: zone.name,
          zoneNumber: zone.zoneNumber,
          rachioZoneId: zone.id,
          imageURL: zone.imageUrl
        };
      })
    }]
  };

  return db.User.create(user, {
    include: [{
      model: db.Device,
      include: [db.Zone]
    }]
  });
};

module.exports.saveUser = saveUser;