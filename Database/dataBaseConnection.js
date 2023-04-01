import mongoose from "mongoose";
const dataBaseConnection=async()=>{
  await mongoose.connect("mongodb://localhost:27017/Ecom")
}

export default dataBaseConnection;