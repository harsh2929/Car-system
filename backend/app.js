const express = require('express');
const mongoose = require('mongoose');
const app = express();
const usersRoute = require('./routes/users');
const carsRoute = require('./routes/cars');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', usersRoute);
app.use('/api/cars', carsRoute);

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(process.env.PORT || 5000, () => console.log('Server running on port 5000')))
.catch(err => console.log(err));

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Car Management API',
        version: '1.0.0',
        description: 'API documentation for Car Management Application',
      },
      servers: [
        {
          url: 'http://localhost:5000/api',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./routes/*.js'],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));