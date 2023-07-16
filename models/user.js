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
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notNull: { 
          msg: "name required" 
        },
        notEmpty: {
          msg: 'name cannot be empty',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true
    },
    birtdate: {
      type: DataTypes.DATE,
      allowNull: true,
      trim: true,
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notNull: { msg: "password required" },
        notEmpty: {
          msg: 'password cannot be empty',
        },
      },
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      trim: true,
      unique: true,
      validate: {
        notNull: { 
          msg: "email required" 
        },
        notEmpty: {
          msg: 'email cannot be empty',
        },
        isEmail: {
          msg: 'Email address is not valid',
        },
      },
    },
    is_delete: DataTypes.BOOLEAN,
    lastLoginDate: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

module.exports = User;