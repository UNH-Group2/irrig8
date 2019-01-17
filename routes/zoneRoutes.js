var db = require("../models");
var rachioService = require("../services/rachioService");
var zoneDetailsRepository = require("../repositories/zoneDetailsRepository");

module.exports = function (app) {

  app.get("/api/device/:deviceId/zones", function (req, res) {
    db.Zone.findAll({
      where: {
        DeviceId: req.params.deviceId
      }
    }).then(function (dbZone) {
      res.json(dbZone);
    }).catch(error => {
      console.log(error);
    });
  });

  app.get("/api/device/:deviceId/zones/:zoneId/details", function (req, res) {
    db.ZoneUsage.findAll({
      where: {
        id: req.params.ZoneId
      }
    }).then(function (dbZone) {
      res.json(dbZone);
    });
  });

  app.put("/api/zone/on", function (req, res) {
    rachioService.turnOnZone(req.body.zoneId)
      .then(() => {
        zoneDetailsRepository.saveZoneUsagePowerOn(req.body.zoneId)
          .then((resp) => {
            console.log(resp);
            return res.json(resp);
          }).catch(() => {
            console.log("power on db error");
            return res.status(500).end();
          });
      });
  });

  app.put("/api/zone/off", function (req, res) {
    rachioService.turnOffZone(req.body.deviceId)
      .then(() => {
        zoneDetailsRepository.saveZoneUsagePowerOff(req.body.deviceId)
          .then(resp => {
            console.log(resp);
            return res.json(resp);
          }).catch(() => {
            console.log("power off db error");
            return res.status(500).end();
          });
      });
  });
};