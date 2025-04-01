import React from 'react'
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();
  const onFinish = async (values)=>{
    try {
      const response = await axios.post('http://localhost:5000/api/user/register',values);
      if (response.data.success)
      {
        toast.success(response.data.message);
        navigate('/login');
      } 
      else{
        toast.error(response.data.message);
      } 
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className='authentication' >
      <div className=' authentication-form card p-2' >
        <h1 className='card-title' >Nice to meet you</h1>  
        <Form layout='vertical' onFinish={onFinish} >
          <Form.Item label='Name' name='name' >
            <Input placeholder='Name' />
          </Form.Item>
          <Form.Item label='Email' name='email' >
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item label='Password' name='password' >
            <Input placeholder='Password' type='password' />
          </Form.Item>
          <Button type='primary' htmlType="submit" className='primary-button'>REGISTER</Button>

          <Link className='anchor my-2' to = '/login'>CLICK HERE TO LOGIN</Link>
        </Form>
      </div>
    </div>
  )
}

export default Register