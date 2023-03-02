require('dotenv').config({ path: '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const userRouter = require('./Routes/userRoutes.js');
const gstRouter = require('./Routes/gstRoutes.js');
const reviewRouter = require('./Routes/reviewRoutes.js');

const App = express();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDb Connected...!')
    })
    .catch((error) => {
        console.log('Error while connecting database :', error)
    })

App.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
    })
);
App.use(bodyParser.json());

/* --------- Swagger ui --------- */
App.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* --------- User Routes --------- */
App.use('/api/v1/users', userRouter);

/* --------- Gst Routes --------- */
App.use('/api/v1/gst', gstRouter);

/* --------- Review Routes --------- */
App.use('/api/v1/review', reviewRouter);

module.exports = App;