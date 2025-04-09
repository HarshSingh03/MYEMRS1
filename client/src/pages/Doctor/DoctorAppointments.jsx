import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout.jsx";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table } from "antd";
import { showLoading, hideLoading } from "../../redux/alertsSlice.js";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
function DoctorAppointments() {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState(null);
  // const navigate = useNavigate();
  // const user = useSelector((state)=>state.user)
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "http://localhost:5000/api/doctor/get-appointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response)
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/doctor/change-appointment-status",
        {
          appointmentId:record._id,
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(`Appointment ${status} successfully.`)
        getAppointmentsData();
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Appointment status change failed")
      console.log(error);
    }
  };
  console.log(appointments);
  useEffect(() => {
    getAppointmentsData();
  }, []);
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <div>{record.userInfo.name}</div>,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.userInfo.phoneNumber}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {record.date.format("DD-MM-YYYY")}{" "}
          {record.time.format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex" >
              <h1
                className="anchor px-2 "
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                Reject
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default DoctorAppointments;
