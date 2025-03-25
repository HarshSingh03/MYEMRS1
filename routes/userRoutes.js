import express from 'express';
import User from '../models/userModels.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import Doctor from '../models/doctorModel.js';
import { loginUser, registerUser } from '../controllers/userController.js';


const router = express.Router();

router.post('/register',registerUser )

router.post('/login',loginUser)


router.get('/get-user-info-by-id',authMiddleware,async(req,res)=>{
  try {
    const user = await User.findById(req.body.userId);
    user.password = undefined;
    if(!user){
      return res.status(404).json({message:'User not found',success:false});
    }else{
      res.status(200).json({
        success:true,
        data:user
      })
    }
  } catch (error) {
    return res.status(500).json({message:"Error getting user info", success:false,error}) ;
  }
});

router.post('/apply-doctor-account',async (req,res)=>{
   try{
      const newDoctor = new Doctor({...req.body, status:'pending'});
      await newDoctor.save();
      const adminUser = await User.findOne({isAdmin:true});
      const unseenNotifications = adminUser.unseenNotifications;
      unseenNotifications.push( {type:'new-doctor-request',
      message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data:{
        doctorId:newDoctor._id,
        doctorName:newDoctor.firstName+' '+newDoctor.lastName
      },
    onClickPath:"/admnin/doctors"
    });
    await User.findByIdAndUpdate(adminUser._id,{unseenNotifications});
    }catch(error){
      
      res.status(500).json({message:"Error applying doctor account",success:false})
    }
} )

export default router;