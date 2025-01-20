import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import UserDashboard from "./UserDashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import EditorDashboard from "./EditorDashboard.jsx";
import axios from "axios";
import { useCookies } from "react-cookie";
import avator from '/image/1.png';

function Dashboard() {
  const location = useLocation();
  const [cookies] = useCookies(["role", "access_token"]);
  const [profileImage, setProfileImage] = useState(avator); 

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get("http://localhost:8000/info", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        
        if (response.status === 200 && response.data.photo_name) {
          const imagePath = `http://localhost:8000/profiles/${response.data.photo_name}`;
          setProfileImage(imagePath); 
        }
      } catch (error) {
        console.error("خطا در دریافت تصویر پروفایل:", error);
      }
    };

    fetchProfileImage();   
     
  }, [cookies.access_token]);

  const renderProfileComponent = () => {
    if (cookies.role === "admin") {
      return <AdminDashboard />;
    } else if (cookies.role === "editor") {
      return <EditorDashboard />;
    } else {
      return <UserDashboard />; 
    }
  };

  return (
  <div className="Dashboard_container">
    <div className="Dashboard_main">
      {location.pathname === "/Dashboard" && renderProfileComponent()}
      <Outlet />
    </div>
    <div className="Dashboard_sidebar">
      <div className="Dashboard_sidebar_top">
       
        <div className="Dashboard_curved_section">
          <div className="Dashboard_curved_background"></div>
          <Link className="Dashboard_sidebar_link_img"  to="Image">
                  <img
                  src={profileImage}
                  alt="User Avatar"
                  className="Dashboard_curved_img"
                  />
          </Link>
        </div>
      </div>
      <div className="Dashboard_sidebar_bottom">
        <ul className="Dashboard_sidebar_menu">
          <li
            className={`Dashboard_sidebar_item ${
              location.pathname === "/Dashboard" ? "active" : ""
            }`}
          >
            <Link to="/Dashboard" className="Dashboard_sidebar_link">
              پنل کاربری
            </Link>
          </li>
          <li
            className={`Dashboard_sidebar_item ${
              location.pathname === "/Dashboard/Account" ? "active" : ""
            }`}
          >
            <Link to="Account" className="Dashboard_sidebar_link">
              اطلاعات حساب
            </Link>
          </li>
          <li
            className={`Dashboard_sidebar_item ${
              location.pathname === "/Dashboard/Content" ? "active" : ""
            }`}
          >
            <Link to="Content" className="Dashboard_sidebar_link">
                  ایجاد مطلب
            </Link>
          </li>
          <li
            className={`Dashboard_sidebar_item ${
              location.pathname === "/Dashboard/Exam" ? "active" : ""
            }`}
          >
            <Link to="Exam" className="Dashboard_sidebar_link">
              آزمون
            </Link>
          </li>
          <li className="Dashboard_sidebar_item Dashboard_sidebar_logout">
            <Link to="/Login" className="Dashboard_sidebar_link">
              خروج
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
  );
}

export default Dashboard;







