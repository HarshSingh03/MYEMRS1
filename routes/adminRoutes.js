import express from 'express'
import User from '../models/userModels.js'
import Doctor from '../models/doctorModel.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/get-all-users',authMiddleware,async (req,res)=>{
  try {
    const isAdmin = await User.findById(req.body.userId).select('isAdmin');
    if (!isAdmin){
      return res.status(500).json({
        success:false,
        message:'Unauthorized',
      })
    }
    const users = await User.find().select('-password');
    return res.status(200).json({
      success:true,
      data:users
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:'Cannot fetch users',
      error
    })
  }
});


router.get('/get-all-doctors',authMiddleware,
  async (req,res)=>{
    try {
      const isAdmin = await User.findById(req.body.userId).select('isAdmin');
      if (!isAdmin){
        return res.status(500).json({
          success:false,
          message:'Unauthorized',
        })
      }
      const doctors = await Doctor.find();
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




router.post('/change-doctor-account-status',authMiddleware,async (req,res)=>{
  try {
    const {doctorId, status} = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId,{status});
    const user = await User.findByIdAndUpdate(doctor.userId,{$push:{unseenNotifications:{
      type:'doctor-account-request-changed',
      message:`${doctor.firstName} ${doctor.lastName}'s doctors account status has been ${status}`,
      onClickPath:'/notifications'
    }}})

    user.isDoctor = status==='approved' ? true: false;
    user.save();
    // unseenNotifications.push({
    //   type:'doctor-account-request-changed',
    //   message:`${doctor.firstName} ${doctor.lastName}'s doctors account status has been ${status}`,
    //   onClickPath:'/notifications'
    // })
    // await User.findByIdAndUpdate(userId,usernotifications,{new:true});
    res.status(200).json({
      message:'Doctor status updated successfully',
      success:true,
      data:doctor
    })
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