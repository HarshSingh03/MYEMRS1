import express from 'express';
import { configDotenv } from 'dotenv';
import dbConfig from './config/dbConfig.js'
import userRouter from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'
import cors from 'cors';
configDotenv();
const app = express();


const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());
app.use('/api/user',userRouter);
app.use('/api/admin',adminRoutes);
app.use('/api/doctor',doctorRoutes);
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({
    success:false,
    message:err.message
  })
})
app.listen(port, ()=>{
  console.log(`Node server listening on port:${port}`)
})
