import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/alertsSlice.js";
import toast from "react-hot-toast";
import DoctorForm from "../components/DoctorForm.jsx";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Button, DatePicker, Row, TimePicker, Col } from "antd";

function BookAppointment() {
  // const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);
  const { user } = useSelector((state) => state.user);
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response)
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  const bookNow = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId:user._id,
          doctorInfo:doctor,
          userInfo:user,
          date:date,
          time:time
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response)
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      dispatch(hideLoading());
    }
  }
  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor?.firstName} {doctor?.lastName}
          </h1>
          <hr />
          <Row>
            <Col span={8} sm={24} xs={24} lg={8} >
              <h1 className="normal-text">
                <b>Timings : </b> {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
              <div className="d-flex flex-column ">
                <DatePicker format="DD/MM/YYYY" onChange={(value)=>setDate(moment(value).format("DD-MM-YYYY"))} />
                <TimePicker format="HH:mm" className="mt-3" onChange={(value)=>setTime(
                  moment(value).format("HH:mm")
                )} />
                <Button className="primary-button mt-2" >
                  Check Availability
                </Button>
                <Button className="primary-button mt-2" onClick={bookNow} >
                  Book Now
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
