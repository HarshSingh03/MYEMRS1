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

router.post('/apply-doctor-account',authMiddleware,async (req,res)=> {
   try{
      const newDoctor = new Doctor({...req.body, status:'pending'});
      console.log(req.body);
      await newDoctor.save();
      const adminUser = await User.findOne({isAdmin:true});
      console.log(adminUser,'admin')
      const unseenNotifications = adminUser.unseenNotifications;
      unseenNotifications.push( {type:'new-doctor-request',
      message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data:{
        doctorId:newDoctor._id,
        doctorName:newDoctor.firstName+' '+newDoctor.lastName
      },
    onClickPath:"/admin/doctorslist"
    });
    await User.findByIdAndUpdate(adminUser._id,{unseenNotifications});
    res.status(200).json({
      success:true,
      message:"Applied successfully for Doctor"
    })
    }catch(error){
      console.log(error);
      res.status(500).json({message:"Error applying doctor account",success:false})
    }
} )

router.post('/mark-all-notifications-as-seen',authMiddleware,async (req,res)=> {
  try{
    const user = await User.findOne({_id:req.body.userId});
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    user.seenNotifications = unseenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];
    user.seenNotifications = seenNotifications;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).json({
      success:true,
      message:'All notifications marked as seen',
      data:updatedUser,
    });
   }catch(error){
     console.log(error);
     res.status(500).json({message:"Error applying doctor account",success:false})
   }
} );

router.delete('/delete-all-notifications',authMiddleware,async (req,res)=> {
  try {
    const user = await User.findOne({_id:req.body.userId});
    user.unseenNotifications=[];
    user.seenNotifications=[];
    const updatedUser = user.save();
    updatedUser.password = undefined;
    res.status(200).json({
      success:true,
      message:"All notifications marked as seen",
      data:updatedUser
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:'Error applying doctor account',
      success:false,
      error,
    })
  }
});


router.get('/get-all-approved-doctors',authMiddleware,
  async (req,res)=>{
    try {
      const doctors = await Doctor.find({status:'approved'});
      return res.status(200).json({
        success:true,
        data:doctors
      });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:'Cannot fetch users',
        error
      })
    }
  })


export default router;