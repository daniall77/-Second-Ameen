import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Profile from "./Profile.jsx";
import AdminProfile from "./AdminProfile.jsx";
import EditorProfile from "./EditorProfile.jsx";
import { useCookies } from "react-cookie"; 

function Dashboard() {
  const location = useLocation();
  const [cookies] = useCookies(["userImage" , "role"]); 

  const renderProfileComponent = () => {
    if (cookies.role === "admin") {
      return <AdminProfile />;
    } else if (cookies.role === "editor") {
      return <EditorProfile />;
    } else  {
      return <Profile />;
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
          <Link to="Image">
            <img   
              src={cookies.userImage || "https://www.w3schools.com/howto/img_avatar.png"} 
              alt="User Avatar"
            />
          </Link> 
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
                location.pathname === "/Dashboard/Hesab" ? "active" : ""
              }`}
            >
              <Link to="Hesab" className="Dashboard_sidebar_link">
                اطلاعات حساب
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
            <li className="Dashboard_sidebar_item">
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




