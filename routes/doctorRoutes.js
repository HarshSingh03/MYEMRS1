import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import Doctor from '../models/doctorModel.js'
import Appointment from '../models/appointmentModel.js';
const router = express.Router();

router.get('/get-doctor-info-by-user-id',authMiddleware,async (req,res)=>{
  try {
    const doctor = await Doctor.findOne({userId:req.body.userId});
    res.status(200).json({
      success:true,
      message:'Doctor fetched successfully',
      data:doctor
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:'Error in fetching doctor info',
      error:error.message
    })
    console.log(error)
  }
})

router.post('/get-doctor-info-by-id',authMiddleware,async (req,res)=>{
  try {
    console.log(req.body)
    const doctor = await Doctor.findOne({_id:req.body.doctorId});
    res.status(200).json({
      success:true,
      message:'Doctor fetched successfully',
      data:doctor
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:'Error in fetching doctor info',
      error:error.message
    })
    console.log(error)
  }
})


router.post('/update-doctor-profile',authMiddleware,async (req,res)=>{
  try {
    const doctor = await Doctor.findOneAndUpdate({userId:req.body.userId},req.body);
    res.status(200).json({
      success:true,
      message:'Doctor profile updated successfully',
      data:doctor
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:'Error updating doctor info',
      error:error.message
    })
    console.log(error)
  }
})


router.get('/get-appointments-by-doctor-id',authMiddleware,async(req,res)=>{
  try {
    const doctor = await Doctor.findOne({userId: req.body.userId});
    const appointments = await Appointment.find({doctorId:doctor._id});
    return res.status(200).json({
      success:true,
      data:appointments,
      message:'Appointments fetched successfully'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false, message:"Error fetching appointments", error})
  }
})
















export default router