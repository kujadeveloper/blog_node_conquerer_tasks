const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Category extends Model {
  static associate(models) {
    
  }
}

Category.init(
  {
    name: DataTypes.STRING,
    is_delete: DataTypes.BOOLEAN
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'category',
  }
);

module.exports = Category;