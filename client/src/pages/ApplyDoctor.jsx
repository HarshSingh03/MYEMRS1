import React from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {showLoading, hideLoading} from '../redux/alertsSlice.js';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm.jsx";
import moment from "moment";


function ApplyDoctor() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading())
      console.log(values.timings[0],values.timings[1],typeof values.timings[0])
      const response = await axios.post('http://localhost:5000/api/user/apply-doctor-account',{...values,userId:user._id,
              timings:[
                moment(values.timings[0]).format("HH:mm"),
                moment(values.timings[1]).format("HH:mm")
              ]},
       { headers:{
Authorization: `Bearer ${localStorage.getItem('token')}`
        }}
      );
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
      <h1 className="page-title">Apply Doctor</h1>
      <DoctorForm onFinish={onFinish} />    
      </Layout>
  );
  }

  

export default ApplyDoctor;
