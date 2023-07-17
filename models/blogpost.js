const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); 
const Comments = require('./comments'); 
const Category = require('./category'); 

class BlogPost extends Model {
  static associate(models) {
    this.belongsTo(User, { foreignKey: 'userId', as:'User' });
    this.belongsTo(models.Category, { foreignKey: 'categoryId', as:'Category' });
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Category', // Name of the referenced model
        key: 'id', // Primary key of the referenced model
      },
      validate: {
        notNull: { 
          msg: "categoryId required" 
        },
        notEmpty: {
          msg: 'categoryId cannot be empty',
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
BlogPost.User = BlogPost.belongsTo(User, { foreignKey: 'userId' });
BlogPost.Category = BlogPost.belongsTo(Category, { foreignKey: 'categoryId' });
BlogPost.Comments = BlogPost.hasMany(Comments, { foreignKey: 'blogId' });
module.exports = BlogPost;