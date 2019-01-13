// ZoneUsage - represents the activity performed by an irrigation Zone
module.exports = function (sequelize, DataTypes) {
  var zoneUsage = sequelize.define("ZoneUsage", {

    startDateTime: {
      type: DataTypes.DATE
    },
    
    endDateTime: {
      type: DataTypes.DATE
    }
  }, {
    freezeTableName: true
  });

  // Foreign Key - ZoneUsage owned by Zone
  zoneUsage.associate = function (models) {
    // A Usage entry can't be created without an Zone
    zoneUsage.belongsTo(models.Zone, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return zoneUsage;

};