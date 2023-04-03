import express from "express";
import { APP_PORT } from "./config/index.js";
import router from "./routes/index.js";
import errorHandler from "./MiddleWares/errorHandler.js";
import dataBaseConnection from "./Database/dataBaseConnection.js";
import path from "path";
import { fileURLToPath } from 'url';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
dataBaseConnection();
console.log("DataBase Connected successfully");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.appRoot = path.resolve(__dirname);
app.use("/api", router);
app.get("/", (req, res) => {
    res.send("Hii,i creating first api");
});


app.use(errorHandler);
app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);

})