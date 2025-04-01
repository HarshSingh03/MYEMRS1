import React from "react";
import "@ant-design/v5-patch-for-react-19";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home.jsx";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import ApplyDoctor from "./pages/ApplyDoctor.jsx";
import Notifications from "./pages/Notifications.jsx";
import UsersList from "./pages/Admin/UsersList.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";
import Profile from "./pages/Doctor/Profile.jsx";
import BookAppointment from "./components/BookAppointment.jsx";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-doctor"
          element={
            <ProtectedRoute>
              <ApplyDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/userslist"
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctorslist"
          element={
            <ProtectedRoute>
              <DoctorsList/>
            </ProtectedRoute>
          }
        />
       <Route
          path="/doctor/profile/:doctorId"
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }
        />
        <Route 
        path = '/book-appointment/:doctorId'
        element={
          <ProtectedRoute>
            <BookAppointment/>
          </ProtectedRoute>
        }/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
