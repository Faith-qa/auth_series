
const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');

const app = express();
const filmRoute = require('./routes/film')
const authRoute = require('./routes/auth')

const connectToMongo = async() =>{
    await mongoose.connect(process.env.db_CONNECTOR);
    console.log("mongo connected")
}
connectToMongo();
app.use(bodyParser.json())
app.use('/api/film', filmRoute);
app.use('/api/user', authRoute);


app.listen(3000, ()=>{
    console.log('server is running')
})