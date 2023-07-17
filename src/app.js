const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const elasticRoutes = require('./routes/elasticRoutes');
require("dotenv").config();

const app = express();


app.use(express.json());

// API rotaları
app.use('/auth', authRoutes);
app.use('/api', blogRoutes);
app.use('/elastic', elasticRoutes);

// Swagger UI ayarları
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
