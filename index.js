const express= require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const app=express();
const userRoute=require('./router/user');
const authRoute =require('./router/auth');
const postRoute = require('./router/post');
dotenv.config();

mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("Connected to mongodb");
})

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);

const server=app.get('/',(req,res)=>{
    res.send("<h1>Hii from express js </h1>");
});

server.listen(3000);

