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
        model: 'user', // Name of the referenced model
        key: 'id', // Primary key of the referenced model
      },
    },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    is_delete: DataTypes.BOOLEAN
  },
  {
    sequelize,
    modelName: 'blogs',
    tableName: 'blogs',
  }
);

module.exports = BlogPost;