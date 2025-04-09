import React,{useEffect, useState} from "react";
import Layout from "../../components/Layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {showLoading, hideLoading} from '../../redux/alertsSlice.js';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../../components/DoctorForm.jsx";

function Profile() {
  const dispatch = useDispatch();
  const [doctor, setDoctor ] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state)=>state.user)
  const getDoctorData = async()=>{
    try {
      dispatch(showLoading())
      const response = await axios.get('http://localhost:5000/api/doctor/get-doctor-info-by-user-id',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      // console.log(response)
      dispatch(hideLoading());
      if (response.data.success){
        setDoctor(response.data.data);
      }
      
    } catch (error) {
      console.log(error)
      dispatch(hideLoading())
    }
  }
  useEffect(()=>{
      getDoctorData();
  },[])
  const onFinish = async (values) => {
    try {
      dispatch(showLoading())
      const response = await axios.post('http://localhost:5000/api/doctor/update-doctor-profile',{...values,userId:user._id,
        timings:[
          (values.timings[0]).format("HH:mm"),
          (values.timings[1]).format("HH:mm")
        ]
      },
       { headers:{
Authorization: `Bearer ${localStorage.getItem('token')}`
        }}
      );
      console.log(response);
      dispatch(hideLoading())
      if (response.data.success)
      {
        toast.success(response.data.message);
        navigate('/');
      } 
      else{
        toast.error(response.data.message);
      } 
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
    }
  }
  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {
        doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />
      }     
    </Layout>
  )
}

export default Profile