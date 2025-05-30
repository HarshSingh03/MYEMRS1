import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String, required:true
  },
  email:{
    type:String, required:false
  },
  phoneNumber:{
    type:String, required:true,
  },
  website:{
    type:String, required:true
  },
  address:{
    type:String, required:true,
  },
  specialization:{
    type:String, required:true
  },
  experience:{
    type:String, required:true
  },
  feePerConsultation:{
    type:Number, required:true
  },
  consultationHours:{
    type:Object,
    required:false
  },
  timings:{
    type:Array, required:false
  },
  status:{
    type:String, default:'pending'
  }
},{
  timestamps:true
});
export default mongoose.model('doctors',doctorSchema);