var moment = require("moment");
var db = require("../models");

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

// getZoneUsageDetails() - get details of current zone
//                       - Zone information:  for specified zone
//                       - Usage Information: for all zones updates to that device
let getZoneUsageDetails = (zoneId) => {
  return db.Zone.findAll({
    include: [{
      model: db.ZoneUsage,
      where: {
        ZoneId: zoneId
      },
    }],
    where: {
      id: zoneId
    }
  });
};

// summarizeZoneUsageDetails() - returns the timestamp values of ZoneUsage fields in pretty format
//                             - calculates the duration the zone was on in hours, minutes, seconds
//                             - records the state of the pump as on/off
let summarizeZoneUsageDetails = (usage) => {

  // local copy so we are able to modify the returned params
  let zone = JSON.parse(JSON.stringify(usage));

  if (zone[0] === undefined) {
    return zone; 
  }

  zone[0].power = "off";
  for (let i=0; (i < zone[0].ZoneUsages.length); i++) {
    let detail = zone[0].ZoneUsages[i];
    let start = moment(detail.startDateTime).utc();
    let end = 0;
    let minutes = 0;
    let seconds = 0;

    if (detail.endDateTime !== null) {
      end = moment(detail.endDateTime).utc();
      hours = parseInt((end - start) / 1000 / 60 / 60);
      minutes = parseInt((end - start) / 1000 / 60) - (hours*60);
      seconds = (end - start) / 1000 - (minutes*60);

      detail.hours = hours;
      detail.minutes = minutes;
      detail.seconds = seconds;
      detail.endDateTime = end.format("MMMM Do YYYY, h:mm:ss a");
    } else if (i === (zone[0].ZoneUsages.length - 1)) { 

      // most recent end time stamp is empty, pump must be on
      zone[0].power = "on";
    } 

    detail.startDateTime = start.format("MMMM Do YYYY, h:mm:ss a");
  }
  
  console.log(JSON.stringify(zone,null,2));
  return zone;
};

module.exports.saveZoneUsagePowerOn = saveZoneUsagePowerOn;
module.exports.saveZoneUsagePowerOff = saveZoneUsagePowerOff;
module.exports.getZoneUsageDetails = getZoneUsageDetails;
module.exports.summarizeZoneUsageDetails = summarizeZoneUsageDetails;