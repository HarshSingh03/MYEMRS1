import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";

function Layout({ children }) {
  const { user } = useSelector((state) => state.user);
  // console.log( "user in layout",user._id);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    },
    // {
    //   name: "Profile",
    //   path: "/profile",
    //   icon: "ri-user-line",
    // },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
    {
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-user-star-line",
    },
  ];

  const doctorMenu=[
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },

  ]
  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor? doctorMenu : userMenu;
  
  const role = user?.isAdmin ? 'Admin' : user?.isDoctor? 'Doctor' : 'User';

  return (
    <div className="main p-2">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header logo">
            <h1>MY{collapsed && "EMRS"}</h1>
            <h1 className="role">{role}</h1>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={menu.name}
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <Link to={menu.path}>
                    <i className={menu.icon}></i>
                    {collapsed && menu.name}
                  </Link>
                </div>
              );
            })}
            <div onClick={()=>{
              localStorage.clear();
              navigate('/login');
            }} className='d-flex menu-item'>
                    <i className='ri-logout-circle-line'></i>
                    {collapsed && 'Logout'}
                </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}
            <div className="d-flex align-items-center px-4">
              <Badge count={user?.unseenNotifications?.length}
              onClick={()=>navigate('/notifications')}>
              <i className="ri-notification-line header-action-icon px-3"></i>
    </Badge>
              <Link className="anchor" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
