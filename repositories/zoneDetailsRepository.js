var moment = require("moment");
var db = require("../models");

// saveZoneUsagePowerOn() - record start time for only the specified zone 
let saveZoneUsagePowerOn = (zoneId) => {

  var utcDate = moment.utc().format();
  var localTime = moment.utc(utcDate).local().format("YYYY-MM-DD HH:mm:ss");

  let zoneUsage = {
    startDateTime: localTime,
    ZoneId: zoneId
  };

  return db.ZoneUsage.create(zoneUsage, { raw : true });

};

// saveZoneUsagePowerOff() - record end times for *all active* zones of given device using this SQL logic
// 
// -- Power off - ANSI SQL
// UPDATE zoneusage
// 	INNER JOIN zone ON zoneusage.ZoneId = zone.id
//  INNER JOIN device ON zone.DeviceId = device.id
// SET zoneusage.EndDateTime = "2019-01-17 12:11:00" (current time)
// where device.id = XXX and 
//          device.id = zone.DeviceId and 
//          zone.id = zoneusage.ZoneId and 
//          Zoneusage.endDateTime = "1970-01-01 00:00:00";  (no date)

let saveZoneUsagePowerOff = (deviceId) => {

  var utcDate = moment.utc().format();
  var localTime = moment.utc(utcDate).local().format("YYYY-MM-DD HH:mm:ss");
  
  return db.ZoneUsage.update({
    endDateTime: localTime
  }, {
    raw : true,
    include: [{
      model: db.Zone,
      include: [{
        model: db.Device,
        where: {
          id: deviceId
        }
      }],
      where: {
        id: db.ZoneUsage.ZoneId
      }
    }],
    where: {
      endDateTime: null
    }
  });
};


module.exports.saveZoneUsagePowerOn = saveZoneUsagePowerOn;
module.exports.saveZoneUsagePowerOff = saveZoneUsagePowerOff;