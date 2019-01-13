// Zone - one zone of irrigation managed by a Device controller
module.exports = function (sequelize, DataTypes) {

  var zone = sequelize.define("Zone", {

    zoneName: {
      type: DataTypes.STRING(100)
    },

    zoneNumber: {
      type: DataTypes.INTEGER(3)
    },

    imageURL: {
      type: DataTypes.STRING(255)
    }
  }, {
    freezeTableName: true
  });

  // Foreign Key - Zone owned by Device
  zone.associate = function (models) {
    // A Zone can't be created without a Device 
    zone.belongsTo(models.Device, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  // Foreign Key - Zone owns ZoneUsage
  zone.associate = function (models) {
    // When a Zone is deleted, also delete any associated Zone Usage references
    zone.hasMany(models.ZoneUsage, {
      onDelete: "cascade"
    });
  };

  return zone;
};