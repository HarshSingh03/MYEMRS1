import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/alertsSlice.js";
import toast from "react-hot-toast";
import DoctorForm from "../components/DoctorForm.jsx";
import { useParams,useNavigate } from "react-router-dom";
import { Button, DatePicker, Row, TimePicker, Col } from "antd";

function BookAppointment() {
  // const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const {navigate} = useNavigate();
  const [isAvailable, setIsAvailable] = useState(false);
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
      setIsAvailable(false);
      dispatch(showLoading());
      console.log(time, "888888888");
      const response = await axios.post(
        "http://localhost:5000/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
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
        setTime('');
        setDate('');
        toast.success(response.data.message);
        navigate("/appointments");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
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
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      dispatch(hideLoading());
    }
  };

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
          <Row gutter={20} className="mt-5" align="middle" >
          <Col>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Yyu5QZKdxtQeZ6vpa4uIF7O5jwhxVcLgmQ&s"
                alt=""
                width="100%"
                height="400"
                />
                
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings : </b> {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
                <hr />
                <p>
                  <b>Phone Number : </b>
                  {doctor.phoneNumber}
                </p>
                <p>
                  <b>Address : </b>
                  {doctor.address}
                </p>
                <p>
                  <b>Fee per Visit : </b>
                  {doctor.feePerConsultation} {doctor.feeType}
                </p>
                <p>
                  <b>Website : </b>
                  {doctor.website}
                </p>
                <p>
                  <b>Timings : </b>
                  {doctor.timings[0]} - {doctor.timings[1]}
                </p>
              <div className="d-flex flex-column ">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setDate(value.format("DD-MM-YYYY"));
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(value.format("HH:mm"));
                  }}
                />
                {!isAvailable && (<Button
                  className="primary-button mt-2"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>)}
                {isAvailable && (
                  <Button
                    className="primary-button mt-2 "
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
            
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
