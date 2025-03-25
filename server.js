import express from 'express';
import { configDotenv } from 'dotenv';
import dbConfig from './config/dbConfig.js'
import userRouter from './routes/userRoutes.js'
import cors from 'cors';
configDotenv();
const app = express();


const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());
app.use('/api/user',userRouter);

app.listen(port, ()=>{
  console.log(`Node server listening on port:${port}`)
})
