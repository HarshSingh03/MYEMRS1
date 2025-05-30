import React from 'react'
import {Form, Row, Col, Input, TimePicker, Button} from 'antd';

function DoctorForm({onFinish, initialValues}) {
  
  return (
      <Form layout="vertical" onFinish={onFinish} initialValues={{...initialValues, 
        ...(initialValues && {timings:[
          initialValues?.timings[0].format("HH:mm"),
          initialValues?.timings[1].format("HH:mm")
        ]})
      }}> 
        <h1 className="card-title mt-3">Personal Information</h1>
        <hr/>
        <Row gutter={20} >
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
        
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Last Name"
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true }]}
            >
              <Input placeholder="PhoneNumber" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20} >
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Web Site"
              name="website"
              rules={[{ required: true }]}
            >
              <Input placeholder="Website" />
            </Form.Item>
          </Col>
       
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Address"
              name="address"
              rules={[{ required: true }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
          </Col>
        </Row>
        <hr/>
        <h1 className="card-title mt-3">Professional Information</h1>
        <hr/>
        <Row gutter={20} >
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Specialization"
              name="specialization"
              rules={[{ required: true }]}
            >
              <Input placeholder="Specialization" />
            </Form.Item>
          </Col>
        
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Experience"
              name="experience"
              rules={[{ required: true }]}
            >
              <Input placeholder="Experience" type="number" />
            </Form.Item>
          </Col>
        
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Fee Per Consultation"
              name="feePerConsultation" 
              rules={[{ required: true }]}
            >
              <Input placeholder="Fee Per Consultation" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20} >
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Timings"
              name="timings"
              rules={[{ required: true }]}
            >
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>
       
          
        </Row>
        <div className="d-flex justify-content-end ">
          <Button className="primary-button" htmlType="submit" >SUBMIT</Button>
        </div>
      </Form>
    
  )
}

export default DoctorForm