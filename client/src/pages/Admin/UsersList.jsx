import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from 'react-redux';
import {showLoading, hideLoading} from '../../redux/alertsSlice.js'
import axios from 'axios';
import { Table } from 'antd';

function UsersList() {
  const [users,setUsers] = useState([]);
  const dispatch = useDispatch();
  const getUsersData = async ()=>{
    try {
      dispatch(showLoading());
      const response = await axios.get('http://localhost:5000/api/admin/get-all-users',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data)
      dispatch(hideLoading());
      if (response.data.success){
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  }
  useEffect(()=>{
    getUsersData();
  },[])

  const columns = [
    {
      title:'Name',
      dataIndex:'name'
    },
    {
      title:'Email',
      dataIndex:'email'
    },
    {
      title:'Created At',
      dataIndex:'createdAt'
    },
    {
      title:'Actions',
      dataIndex:'actions',
      render:(/*text,record*/)=>
        <div className='d-flex' >
          Block
        </div>
      
    }
  ]

  return (
    <Layout>
      <h1 className="page-header">Users List</h1>
      <Table columns={columns} dataSource={users}/>
    </Layout>
  )
}

export default UsersList