var db = require("../models");

let getZones = (userName) => {
  return db.User.findAll({
    raw: true,
    where: {
      userName: userName
    },
    include: [
      {
        model: db.Device,
        include: [
          {
            model: db.Zone
          }
        ]
      }
    ]
  });
};

module.exports.getZones = getZones;