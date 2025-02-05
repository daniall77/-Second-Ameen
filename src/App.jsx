import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { CiUser } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import { IoExitOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [userData, setUserData] = useState({ firstName: null, lastName: null, phoneNumber: null, role: null });
  const [showDetails, setShowDetails] = useState(false);
  const location = useLocation();
  const toastShown = useRef(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    if (location.state?.successMessage && !toastShown.current) {
      toast.success(location.state.successMessage, { duration: 2000 });
      toastShown.current = true;
    }
  }, [location.state]);
 
    useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".header_nav");
      if (window.pageYOffset > 36) {
        nav.classList.add("sticky");
      } else {
        nav.classList.remove("sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  
  useEffect(() => {
    if (cookies.access_token) {
      try {
        const decodedToken = jwt_decode(cookies.access_token);
        if (decodedToken && decodedToken.sub1 && decodedToken.sub2 && decodedToken.sub3 && decodedToken.sub4) {
          setUserData({
            firstName: decodedToken.sub2,
            lastName: decodedToken.sub3,
            phoneNumber: decodedToken.sub1,
            role: decodedToken.sub4,
          });

          setCookie("firstName", decodedToken.sub2, { path: "/", maxAge: 31536000 });
          setCookie("lastName", decodedToken.sub3, { path: "/", maxAge: 31536000 });
          setCookie("phoneNumber", decodedToken.sub1, { path: "/", maxAge: 31536000 });
          setCookie("role", decodedToken.sub4, { path: "/", maxAge: 31536000 });
        } else {
          console.error("Invalid token structure:", decodedToken);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [cookies.access_token]);

 
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/articles");
        setArticles(response.data);
        console.log(response.data);
      } catch (err) {
        setError("مقاله ای برای نمایش وجود ندارد");
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  
  const handleLogout = async () => {
    try {
        console.log("Phone number value:", cookies.access_token);
      if (cookies.access_token) {
        await axios.post(`http://localhost:8000/logout?access_token=${encodeURIComponent(cookies.access_token)}`);
        toast.success("شما از حساب کاربری خود خارج شدید");
        removeCookie("access_token", { path: "/" });
        setUserData({ firstName: null, lastName: null, phoneNumber: null, role: null });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("مشکلی در خروج از حساب کاربری رخ داده است");
    }
  };

  return (
    <>
      <div className="container" dir="rtl">
        <Toaster position="top-center" reverseOrder={false} />
        
       
        <div className="header">
          <nav className="header_nav">
            <div className="header_navbar_right">
              <ul className="header_navbar_right_ul">
                <li className="header_navbar_right_li"> خانه</li>
                <li className="header_navbar_right_li"> خدمات</li>
                <li className="header_navbar_right_li">درباره ما</li>
                <li className="header_navbar_right_li">  <Link to="/ListMatches">مسابقات</Link> </li>
              </ul>
            </div>
            <div className="header_navbar_left">
              {!cookies.access_token ? (
                <Link to="/Login">
                  <div className="header_navbar_left_div">
                    <button className="header_navbar_left_button"> ورود | عضویت </button>
                  </div>
                </Link>
              ) : (
                <>
                  <div className="user_icon" onClick={() => setShowDetails(!showDetails)}>
                    <CiUser className="user_icon_CiUser" />
                  </div>
                  {showDetails && (
                    <div className="user_details">
                      <div className="user_details_div">    {userData.firstName}  {userData.lastName}  خوش آمدی </div>
                      <div className="user_details_div"> 
                           <AiOutlineHome className="user_details_AiOutlineHome" />
                          <Link to="/Dashboard" className="user_details_div_panel">
                            <div className="user_details_div_panel">پنل کاربری</div>
                          </Link>
                      </div>
                      <div className="user_details_div"> 
                            <IoExitOutline className="user_details_IoExitOutline" />
                            <button className="logout_button" onClick={handleLogout}>
                              خروج 
                            </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </nav>
        </div>

       
        <div className="content">
          {loading ? (
              <ScaleLoader className="content_ScaleLoader" />
          ) : error ? (
            <p className="content_error">{error}</p>
          ) : (
            <div className="content_articles">
              {articles.map((article) => (
                <div key={article.id} className="content_articles_div">
                  <h2 className="content_articles_h">{article.title}</h2>
                  <p className="content_articles_author">متن: {article.text}</p>
                  <img
                    src={`http://localhost:8000/articles/${article.photo}`}
                    alt="Article"
                    className="content_articles_image"
                  />
                  <p className="content_articles_author">نویسنده: {article.author_id}</p>
                  <p className="content_articles_author">تاریخ ایجاد: {article.created_at}</p>
                  {article.updated_at && <p className="content_articles_date">آخرین بروزرسانی: {article.updated_at}</p>}
                  <p className="content_articles_categories">
                    دسته‌بندی‌ها: {article.category.length > 0 ? article.category.join(", ") : "بدون دسته"}
                  </p>
                  <p className="content_articles_author">{article.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="footer"></div>
      </div>
    </>
  );
}

export default App;



