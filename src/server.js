import express  from "express";
import bodyParser from "body-parser";//hỗ trợ lấy các tham số từ client
// /user?id=7 để lấy được số 7 ra thì bắt buộc phải dùng thư viện body-parser
import connectDB from "./config/connectDB";
import viewEngine from  "./config/viewEngine";
import initWebRoutes from './route/web';
// require('dotenv').config({path: './src/.env'});//giúp nó khai báo dotenv để chạy dòng "let port = process.env.PORT || 6969;"
import cors from 'cors';
// require('dotenv').config('.env')
require('dotenv').config(); 
// require("dotenv").config({ path: ".env" });

let app = express();
app.use(cors({ credentials: true,origin: true}));


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',  extended: true}))

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
//Port == underfined => port = 6969

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port)
})

