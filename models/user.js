// User - the user profile with a one-to-one relationship with a Rachio.com user identity
module.exports = function (sequelize, DataTypes) {

  var user = sequelize.define("User", {
    fullName: {
      type: DataTypes.STRING(50)
    },

    email: {
      type: DataTypes.STRING(50)
    },

    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1]
      }
    },

    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1]
      }
    },

    rachioOAuthToken: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1]
      }
    },

    rachioUserId: {
      type: DataTypes.STRING(50)
    }
  }, {
    freezeTableName: true
  });

  // Foreign Key - User owns many Devices
  user.associate = function (models) {
    // When a User is deleted, also delete any associated Devices
    user.hasMany(models.Device, {
      onDelete: "cascade"
    });
  };

  return user;

};