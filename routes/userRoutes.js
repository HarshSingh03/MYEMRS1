import express from "express";
import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Doctor from "../models/doctorModel.js"
import { loginUser, registerUser } from "../controllers/userController.js";
import Appointment from '../models/appointmentModel.js'
import moment from 'moment'

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    user.password = undefined;
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    } else {
      res.status(200).json({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting user info", success: false, error });
  }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    console.log(req.body);
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    console.log(adminUser, "admin");
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        doctorName: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).json({
      success: true,
      message: "Applied successfully for Doctor",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error applying doctor account", success: false });
  }
});

router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      user.seenNotifications = unseenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).json({
        success: true,
        message: "All notifications marked as seen",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error applying doctor account", success: false });
    }
  }
);

router.delete("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.unseenNotifications = [];
    user.seenNotifications = [];
    const updatedUser = user.save();
    updatedUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});



router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending"
    req.body.date = moment(req.body.date,"DD/MM-YYYY").toISOString();
    req.body.time= moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = await Appointment(req.body);
    await newAppointment.save();
    // pushing notifications to doctors on his userId
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications?.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: '/doctor/appointments'
    });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Appointment booked successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
    console.log(error);
  }
});


router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD/MM/YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(60, "minute").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(60, "minute").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
      // status:"approved"
    });
    if (appointments.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Appointments not available",
      })
    }
    else {
      return res.status(200).json({
        success: true,
        message: "Appointments available",
      })
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
    console.log(error);
  }
});


router.get('/get-all-approved-doctors', authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'approved' });
    return res.status(200).json({
      success: true,
      data: doctors,
      message: 'Doctors status approved successfully'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message, error })
  }
})
export default router;
