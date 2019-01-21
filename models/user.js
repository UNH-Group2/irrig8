// User - the user profile with a one-to-one relationship with a Rachio.com user identity
module.exports = function (sequelize, DataTypes) {

  //--------------------  
  // Field Definitions -
  //--------------------  

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
      unique: true,
      validate: {
        len: [1]
      }
    },

    password: {
      type: DataTypes.STRING(255),
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

    rachioRefreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [1]
      }
    },

    rachioTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
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

  //----------------------
  // Table Relationships -
  //----------------------

  // Foreign Key - User owns many Devices
  user.associate = function (models) {
    // When a User is deleted, also delete any associated Devices
    user.hasMany(models.Device, {
      onDelete: "cascade"
    });
  };

  //-----------------  
  // Helper Methods
  //-----------------  

  // findById() - find a specific user based on primary key
  user.findById = function (id, cb) {
    process.nextTick(function () {

      user.findOne({
        where: {
          id: id
        }
      })
        .then(function (dbResult) {
          cb(null, dbResult);
        })
        .catch(function () {
          console.log("user.findById() - error - could not complete search request");
          cb(new Error("User " + id + " does not exist"));
        });
    });
  };

  // findByUsername() - find a specific user based on login name
  user.findByUsername = function (username, cb) {
    process.nextTick(function () {

      user.findOne({
        where: {
          userName: username
        }
      })
        .then(function (dbResult) {
          cb(null, dbResult);
        })
        .catch(function () {
          console.log("user.findByUsername() - error - could not complete search request");
          cb(null, record);
        });
    });

  };

  return user;

};