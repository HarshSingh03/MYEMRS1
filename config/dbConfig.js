import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const connect = mongoose.connect(process.env.MONGO_URI);

const connection = mongoose.connection;

connection.on('connected', ()=>{
  console.log('MongoDB is connected');
})

connection.on('error',(error)=>{
  console.log("Error in Mongodb connection:",error);
})

export default mongoose;