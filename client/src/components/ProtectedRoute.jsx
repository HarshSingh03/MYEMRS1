import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { setUser } from '../redux/userSlice.js';
import { hideLoading, showLoading } from '../redux/alertsSlice.js';


function ProtectedRoute(props) {
  const navigate = useNavigate();
  const {user} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const getUser = async()=>{
    try {
      dispatch(showLoading())
      const response = await axios.get('http://localhost:5000/api/user/get-user-info-by-id',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(hideLoading());
      if (response.data.success){
        dispatch(setUser(response.data.data));
      }
      else{
        localStorage.clear()
        navigate('/login')
      }
    } catch (error) {
      localStorage.clear()
      console.log(error)
      dispatch(hideLoading())
      navigate('/login')
    }
  }
  useEffect(()=>{
    if(!user){
      getUser();
    }
  },[])

  if(localStorage.getItem('token'))
    return props.children
  else{
    return <Navigate to='/login' />;
  }
}

export default ProtectedRoute