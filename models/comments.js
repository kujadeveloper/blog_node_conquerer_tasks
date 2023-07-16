const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Comments extends Model {
  static associate(models) {
    Comments.belongsTo(models.User, { foreignKey: 'userId' });
    Comments.belongsTo(models.BlogPost, { foreignKey: 'blogId' });
  }
}

Comments.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user', // Name of the referenced model
        key: 'id', // Primary key of the referenced model
      },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BlogPost', // Name of the referenced model
        key: 'id', // Primary key of the referenced model
      },
    },
    content: DataTypes.STRING,
    is_delete: DataTypes.BOOLEAN
  },
  {
    sequelize,
    modelName: 'Comments',
    tableName: 'comments',
  }
);

module.exports = Comments;