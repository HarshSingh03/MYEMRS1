import User from '../models/userModels.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async(req,res)=>{
  try{
    const userExists = await User.findOne({email:req.body.email});
    if (userExists){
      return res.status(200).json({message:'User already exists',success:false})
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    req.body.password=hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({message:'User created successcully',success:true})

  }catch(error){
    
    res.status(500).json({message:"error creating user",success:false})
  }
}

export const loginUser =  async(req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email});
    if(!user){
      return res.status(200)
      .json({message:"User does not exist",success:false});
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch){
      return res.status(200).json({message:"Password is incorrect",success:false});
    }
    else{
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:'1d'
      })
      return res.status(200).json({message:"Login Successful",success:true,data:token})
    }
  }catch(error){
    console.log(error);
    return res.status(500).json({message:"Error Logging in",success:false,error})
  }
}