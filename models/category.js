const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Category extends Model {
  static associate(models) {
    
  }
}

Category.init(
  {
    name: {
      type: DataTypes.String,
      allowNull: false,
      is_delete: DataTypes.BOOLEAN
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'Category',
  }
);

module.exports = Category;