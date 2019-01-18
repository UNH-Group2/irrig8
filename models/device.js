// Device - Representts the Rachio irrigation controller 
module.exports = function (sequelize, DataTypes) {
  var device = sequelize.define("Device", {
    name: {
      type: DataTypes.STRING(100)
    },

    timeZone: {
      type: DataTypes.STRING(50)
    },

    serialNumber: {
      type: DataTypes.STRING(50)
    },

    macAddress: {
      type: DataTypes.STRING(50)
    },

    locationLatitude: {
      type: DataTypes.DECIMAL(10,8)
    },

    locationLongitude: {
      type: DataTypes.DECIMAL(11,8)
    },
    
    rachioDeviceId: {
      type: DataTypes.STRING(50)
    }
  }, {
    freezeTableName: true
  });

  // Foreign Key - Device owned by a User
  device.associate = function (models) {
    // A Zone can't be created without a Device due to the foreign key constraint
    device.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  // Foreign Key - Device owns many Zones
  device.associate = function (models) {
    // When a Device is deleted, also delete any associated Zones
    device.hasMany(models.Zone, {
      onDelete: "cascade"
    });
  };


  return device;
};