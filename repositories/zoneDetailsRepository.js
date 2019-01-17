var moment = require("moment");

var db = require("../models");

// saveZoneUsagePowerOn() - record start time for only the specified zone 
let saveZoneUsagePowerOn = (zoneId) => {

  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  let zoneUsage = {
    startDateTime: now,
    endDateTime: 0,
    ZoneId: zoneId
  };

  return db.ZoneUsage.create(zoneUsage);

};

// saveZoneUsagePowerOff() - record end times for *all active* zones of given device using this SQL logic
// -- Option 1
// UPDATE device, zone, zoneusage
// SET zoneusage.EndDateTime = "2019-01-30 03:03:03"
// where device.id = 1 and 
// 	  device.id = zone.DeviceId and 
//       zone.id = zoneusage.ZoneId and 
//       Zoneusage.endDateTime = "2019-01-17 12:15:00";

// -- Option 2 - ANSI SQL
// UPDATE zoneusage
// 	INNER JOIN zone ON zoneusage.ZoneId = zone.id
//  INNER JOIN device ON zone.DeviceId = device.id
// SET zoneusage.EndDateTime = "2019-01-17 12:11:00" (current time)
// where device.id = XXX and 
//          device.id = zone.DeviceId and 
//          zone.id = zoneusage.ZoneId and 
//          Zoneusage.endDateTime = "1970-01-01 00:00:00";  (no date)

let saveZoneUsagePowerOff = (deviceId) => {

  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  let noDate = 0;
 
  return db.ZoneUsage.update({
    endDateTime: now
  }, {
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
      endDateTime: noDate
    }
  });
};


module.exports.saveZoneUsagePowerOn = saveZoneUsagePowerOn;
module.exports.saveZoneUsagePowerOff = saveZoneUsagePowerOff;