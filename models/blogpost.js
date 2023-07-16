const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class BlogPost extends Model {
  static associate(models) {
    BlogPost.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

BlogPost.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', // Name of the referenced model
        key: 'id', // Primary key of the referenced model
      },
      validate: {
        notNull: { 
          msg: "userId required" 
        },
        notEmpty: {
          msg: 'userId cannot be empty',
        },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { 
          msg: "title required" 
        },
        notEmpty: {
          msg: 'title cannot be empty',
        },
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { 
          msg: "content required" 
        },
        notEmpty: {
          msg: 'content cannot be empty',
        },
      },
    },
    is_delete: DataTypes.BOOLEAN
  },
  {
    sequelize,
    modelName: 'blogs',
    tableName: 'blogs',
  }
);

module.exports = BlogPost;