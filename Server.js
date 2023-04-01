import express from "express";
import { APP_PORT } from "./config/index.js";
import router from "./routes/index.js";
import errorHandler from "./MiddleWares/errorHandler.js";
import dataBaseConnection from "./Database/dataBaseConnection.js";
const app=express();
app.use(express.json())
dataBaseConnection();
console.log("DataBase Connected successfully");
app.use("/api",router);
app.get("/",(req,res)=>{
    res.send("Hii,i creating first api");
});


app.use(errorHandler);
app.listen(APP_PORT,()=>{
    console.log(`Listening on port ${APP_PORT}`);
    
})