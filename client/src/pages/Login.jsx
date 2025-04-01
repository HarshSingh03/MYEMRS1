import React from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        values
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error.message);
    }
  };
  return (
    <div className="authentication">
      <div className=" authentication-form card p-2">
        <h1 className="card-title">Welcome Back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <d className="flex justify-content-between">

          <Button type="primary" htmlType="submit" className="primary-button">
            Login
          </Button>

          <Link className="anchor my-2" to="/register">
            CLICK HERE TO REGISTER
          </Link>
          </d>
        </Form>
      </div>
    </div>
  );
}

export default Login;
