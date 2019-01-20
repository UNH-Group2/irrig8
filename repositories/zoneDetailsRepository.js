var moment = require("moment");
var db = require("../models");
var Sequelize = require("sequelize");

// saveZoneUsagePowerOn() - record start time for only the specified zone 
let saveZoneUsagePowerOn = (zoneId) => {

  var localTime = moment().format("YYYY-MM-DD HH:mm:ss");

  let zoneUsage = {
    startDateTime: localTime,
    ZoneId: zoneId
  };

  return db.ZoneUsage.create(zoneUsage, {
    raw: true
  });

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

  var localTime = moment().format("YYYY-MM-DD HH:mm:ss");

  return db.ZoneUsage.update({
    endDateTime: localTime
  }, {
    raw: true,
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

// getZoneUsageDetails() - get details of current zone and zone usage
//                       - Zone information:  for specified zone
//                       - Usage Information: for specified zone limited to last 5 entries
//                       - Limit to the last 5 entries returned in ascending order
// (SELECT *
//   FROM Zone  
//      INNER JOIN ZoneUsage ON Zone.id = ZoneUsages.ZoneId AND ZoneUsages.ZoneId = n 
//      WHERE Zone.id = n
//      ORDER BY startDateTime DESC
//      LIMIT 5) ORDER BY startDateTime ASC;
let getZoneUsageDetails = (zoneId) => {
  return db.Zone.findAll({
    include: [{
      model: db.ZoneUsage,
      where: {
        ZoneId: zoneId
      }
      // order: [
      //   ["startDateTime", "DESC"]
      // ],
      // limit: 5
    }],
    where: {
      id: zoneId
    },
  });
};

// summarizeZoneUsageDetails() - returns the timestamp values of ZoneUsage fields in pretty format
//                             - calculates the duration the zone was on in hours, minutes, seconds
let summarizeZoneUsageDetails = (usage) => {

  return new Promise((resolve, reject) => {

    // local copy so we are able to modify the returned params
    let zone = JSON.parse(JSON.stringify(usage));

    // occasionally zones have no usage at startup
    if (zone[0] === undefined) {
      reject("Error calculating zone usage details");
    }

    // Active zone, format the timestamps and set the accumulators
    for (let i = 0;
      (i < zone[0].ZoneUsages.length); i++) {
      let detail = zone[0].ZoneUsages[i];
      let start = moment(detail.startDateTime).utc().local();
      let end = 0;
      let minutes = 0;
      let seconds = 0;
      let hours = 0;

      if (detail.endDateTime !== null) {
        end = moment(detail.endDateTime).utc().local();
        hours = parseInt((end - start) / 1000 / 60 / 60);
        minutes = parseInt((end - start) / 1000 / 60) - (hours * 60);
        seconds = (end - start) / 1000 - (minutes * 60);

        detail.endDateTime = end.format("YYYY-MM-DD HH:mm:ss");
      }

      detail.startDateTime = start.format("YYYY-MM-DD HH:mm:ss");
      detail.hours = hours;
      detail.minutes = minutes;
      detail.seconds = seconds;
    }

    resolve(zone);
  });
};

//  setZonePowerState(usage) - records the state of the pump as on/off based on the ZoneUsage data
//                           - no end date on the most recent time stamp means the zone must be on
let setZonePowerState = (usage) => {

  return new Promise((resolve, reject) => {

//    let zone = JSON.parse(JSON.stringify(usage));
    let zone = usage;

    // occasionally zones have no usage at startup
    if (zone[0] === undefined) {
      reject("Error detecting power on/off state");
    }

    if (zone[0].ZoneUsages.length > 0) {
      let index = zone[0].ZoneUsages.length;
      let lastUsageEvent = zone[0].ZoneUsages[index - 1];

      if (lastUsageEvent.endDateTime === null) {
        zone[0].power = "on";
      } else {
        zone[0].power = "off";
      }
    }

    resolve(zone);
  });
};

module.exports.saveZoneUsagePowerOn = saveZoneUsagePowerOn;
module.exports.saveZoneUsagePowerOff = saveZoneUsagePowerOff;
module.exports.getZoneUsageDetails = getZoneUsageDetails;
module.exports.summarizeZoneUsageDetails = summarizeZoneUsageDetails;
module.exports.setZonePowerState = setZonePowerState;