const { Sequelize } = require('sequelize');
require("dotenv").config();

// Replace the following placeholders with your actual database configuration
const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const dialect = 'postgres'; // e.g., 'mysql', 'postgres', 'sqlite', 'mssql'

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

module.exports = sequelize;
