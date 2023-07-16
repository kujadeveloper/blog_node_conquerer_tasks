const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {

  static associate(models) {
  }

  static validatePassword(password) {
    const passwordRegex = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()\-_=+[{\]};:<>|./?])(?=.{8,})/;

    return passwordRegex.test(password);
  }
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notNull: { 
          msg: "required" 
        },
        notEmpty: {
          msg: 'cannot be empty',
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notNull: { msg: "required" },
        notEmpty: {
          msg: 'cannot be empty',
        },
      },
    },
    username: {
      type:DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notNull: { msg: "required" },
        notEmpty: {
          msg: 'cannot be empty',
        },
      },
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notNull: { msg: "required" },
        notEmpty: {
          msg: 'cannot be empty',
        },
      },
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notNull: { 
          msg: "required" 
        },
        notEmpty: {
          msg: 'cannot be empty',
        },
        isEmail: {
          msg: 'Email address is not valid',
        },
      },
    },
    is_delete: DataTypes.BOOLEAN
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

module.exports = User;