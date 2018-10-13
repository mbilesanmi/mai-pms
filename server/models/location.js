module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    parentLocation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: null,
      validate: {
        isInt: {
          msg: 'Invalid parent location'
        }
      }
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Minimum value allowed is 1 for Zip'
        },
        isInt: {
          msg: 'Invalid zip code'
        },
        notEmpty: true,
      },
      unique: {
        msg: 'Zip already exists',
      }
    },
    male: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Minimum value allowed is 1 for male population'
        },
        isInt: {
          msg: 'Invalid male population'
        },
        notEmpty: true
      }
    },
    female: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Minimum value allowed is 1 for female population'
        },
        isInt: {
          msg: 'Invalid female population'
        },
        notEmpty: true
      }
    }
  })

  Location.associate = models => {
    // associations can be defined here
  };
  return Location;
};
