import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout.jsx'
import { useDispatch } from 'react-redux';
import {showLoading, hideLoading} from '../../redux/alertsSlice.js'
import axios from 'axios';
import { Table } from 'antd';
import {toast} from 'react-hot-toast';

function DoctorsList() {
  const [doctors,setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getDoctorsData = async ()=>{
    try {
      dispatch(showLoading());
      const response = await axios.get('http://localhost:5000/api/admin/get-all-doctors',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data)
      dispatch(hideLoading());
      if (response.data.success){
        toast.success(response.data.message);
        setDoctors(response.data.data);
      }
    } catch (error) {
      toast.error('Something went wrong');
      dispatch(hideLoading());
      console.log(error);
    }
  }

  const changeDoctorStatus = async (record,status)=>{
    try {
      dispatch(showLoading());
      const response = await axios.post('http://localhost:5000/api/admin/change-doctor-account-status',{
        doctorId:record._id, userId:record.userId, status:status
      },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideLoading());
      if (response.data.success){
        getDoctorsData();
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error)
    }
  }
  useEffect(()=>{
      getDoctorsData();
    },[])
  const columns = [
    {
      title:'Name',
      dataIndex:'name',
      render:(text,record)=><div>
        {record.firstName} {record.lastName}
      </div>
    },
    {
      title:'Phone',
      dataIndex:'phoneNumber'
    },
    {
      title:'Created At',
      dataIndex:'createdAt'
    },{
      title:'status',
      dataIndex:'status'
    },
    {
      title:'Actions',
      dataIndex:'actions',
      render:(text,record)=>
        <div className='d-flex' >
          {record.status !== 'approved' && <h1 className='anchor' onClick={()=>changeDoctorStatus(record,'approved')} >Approve</h1>}
          {record.status === 'approved' && <h1 className='anchor' onClick={()=>changeDoctorStatus(record,'blocked')}  >Block</h1>}
        </div>
      
    }
  ]
  return (
    <Layout>
      <h1 className="page-header">Doctors List</h1>
      <Table columns={columns} dataSource={doctors}/>
    </Layout>
  )
}

export default DoctorsList