var db = require("../models");
var rachioService = require("../services/rachioService");
var zoneDetailsRepository = require("../repositories/zoneDetailsRepository");
var passport = require("passport");
var dataCache = require("../utils/dataCache");
var securityUtils = require("../utils/securityUtils");

module.exports = function (app) {

  app.get("/api/device/:deviceId/zones",
    passport.authenticate("basic", {session: false}),
    function (req, res) {
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

  app.get("/api/zones/:zoneId/details",
    passport.authenticate("basic", {session: false}),
    function (req, res) {
      console.log("request parameter for zone details: ", req.params);
      zoneDetailsRepository.getZoneUsageDetails(req.params.zoneId)
        .then((dbResp) => {
          zoneDetailsRepository.summarizeZoneUsageDetails(dbResp)
            .then((response) =>{
              zoneDetailsRepository.setZonePowerState(response)
                .then((resp) =>{
                  console.log(JSON.stringify(resp, null, 2));
                  return res.json(resp);
                });
            });
        });
    });

  app.post("/api/zone/on",
    passport.authenticate("basic", {session: false}),
    function (req, res) {
      let username = securityUtils.getUserNameFromHeader(req.headers);
      dataCache.retrieveValueFromCache(username).then(token =>{
        rachioService.turnOnZone(token, req.body.rachioZoneId)
          .then(() => {
            zoneDetailsRepository.saveZoneUsagePowerOn(req.body.zoneId)
              .then((resp) => {
                return res.json(resp);
              }).catch(() => {
                console.log("power on db error");
                return res.status(500).end();
              });
          });
      });
    });

  app.put("/api/zone/off",
    passport.authenticate("basic", {session: false}),
    function (req, res) {
      let username = securityUtils.getUserNameFromHeader(req.headers);
      dataCache.retrieveValueFromCache(username).then(token => {
        rachioService.turnOffZone(token, req.body.rachioDeviceId)
          .then(() => {
            zoneDetailsRepository.saveZoneUsagePowerOff(req.body.deviceId)
              .then(resp => {
                return res.json(resp);
              }).catch(() => {
                console.log("power off db error");
                return res.status(500).end();
              });
          });
      });
    });
};