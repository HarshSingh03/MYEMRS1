import React,{useEffect, useState} from "react";
import Layout from "../components/Layout.jsx";
import { useDispatch } from "react-redux";
import axios from "axios";
import {Table} from 'antd'
import {showLoading, hideLoading} from '../redux/alertsSlice.js';
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import moment from 'moment';


function Appointments() {
  const dispatch = useDispatch();
  const [appointments, setAppointments ] = useState(null);
  // const navigate = useNavigate();
  // const user = useSelector((state)=>state.user)
  const getAppointmentsData = async()=>{
    try {
      dispatch(showLoading())
      const response = await axios.get('http://localhost:5000/api/user/get-appointments-by-user-id',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      // console.log(response)
      dispatch(hideLoading());
      if (response.data.success){
        setAppointments(response.data.data);
      }
      
    } catch (error) {
      console.log(error)
      dispatch(hideLoading())
    }
  }
  console.log(appointments)
  useEffect(()=>{
      getAppointmentsData();
  },[])
  const columns = [
    {
      title:"Id",
      dataIndex:"_id",
    },
    {
      title:'Doctor',
      dataIndex:'name',
      render:(text,record)=><div>
        {record.doctorInfo.firstName} {record.doctorInfo.lastName}
      </div>
    },
    {
      title:'Phone',
      dataIndex:'phoneNumber',
      render:(text,record)=>
        <span>
          {record.doctorInfo.phoneNumber}
        </span>
      
    },
    {
      title:'Date & Time',
      dataIndex:'createdAt',
      render: (text,record)=>
        <span>{
          moment(record.date).format("DD/MM/YYYY")} {moment(record.time).format("HH:mm")}</span>
      
    },
    {
      title:"Status",
      dataIndex:"status"
    }
  ]
  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table columns={columns} dataSource={appointments}/>
    </Layout>
  )
}

export default Appointments