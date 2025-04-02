import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout';
import { Col, Row } from 'antd';
import Doctor from '../components/Doctor';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice.js';
function Home() {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState(null);
  const getData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get('http://localhost:5000/api/user/get-all-approved-doctors', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      dispatch(hideLoading())
      // console.log(response.data);
      if (response.data.success) {
        console.log(response);
        setDoctors(response.data.data)
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
  }, [])
  return (
    <Layout>
      <Row gutter={20} >
        {doctors?.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  )
}

export default Home