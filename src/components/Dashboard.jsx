import React  from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import UserDashboard from "./UserDashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import EditorDashboard from "./EditorDashboard.jsx";
import { useCookies } from "react-cookie";
import avator from '/image/1.png';

function Dashboard() {
  const location = useLocation();
  const [cookies] = useCookies(["role"]);

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
          <Link to="Image">
            <img
              src={avator}
              alt="User Avatar"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
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













