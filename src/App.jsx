import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { CiUser } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";

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
      toast.success(location.state.successMessage, { duration: 5000 });
      toastShown.current = true;
    }
  }, [location.state]);

  
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
        setError("مشکلی در دریافت مقالات پیش آمد");
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
                <li className="header_navbar_right_li">مطالب</li>
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
                    <CiUser />
                  </div>
                  {showDetails && (
                    <div className="user_details">
                      <div className="div">شماره موبایل: {userData.phoneNumber}</div>
                      <div className="div">نام: {userData.firstName}</div>
                      <div className="div">نام خانوادگی: {userData.lastName}</div>
                      <div className="div">رول: {userData.role}</div>
                      <Link to="/Dashboard">
                        <div className="red">پنل کاربری</div>
                      </Link>
                      <button className="logout_button" onClick={handleLogout}>
                        خروج
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </nav>
        </div>

       
        <div className="content">
          {loading ? (
            <p>در حال بارگذاری...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="articles">
              {articles.map((article) => (
                <div key={article.id} className="article">
                  <h2>{article.title}</h2>
                  <p className="author">متن: {article.text}</p>
                  <img
                    src={`http://localhost:8000/articles/${article.photo}`}
                    alt="Article"
                    className="article-image"
                    style={{ maxWidth: "100%", height: "100px", marginTop: "10px" }}
                  />
                  <p className="author">نویسنده: {article.author_id}</p>
                  <p className="date">تاریخ ایجاد: {article.created_at}</p>
                  {article.updated_at && <p className="date">آخرین بروزرسانی: {article.updated_at}</p>}
                  <p className="categories">
                    دسته‌بندی‌ها: {article.category.length > 0 ? article.category.join(", ") : "بدون دسته"}
                  </p>
                  <p className="content">{article.content}</p>
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




// 3333333333333333333333333333333333333333333333333333333333333333

// import React, { useEffect, useState , useRef  } from "react";
// import "./App.css";
// import { Link, useLocation } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import jwt_decode from "jwt-decode";
// import axios from "axios";
// import { CiUser } from "react-icons/ci";
// import toast, { Toaster } from "react-hot-toast";




// function App() {
//   const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
//   const [userData, setUserData] = useState({ firstName: null, lastName: null, phoneNumber: null, role: null });
//   const [showDetails, setShowDetails] = useState(false);
//   const location = useLocation();
//   const toastShown = useRef(false); 

//   useEffect(() => {
//     if (location.state?.successMessage && !toastShown.current) {
//       toast.success(location.state.successMessage, { duration: 5000 });
//       toastShown.current = true; 
//     }
//   }, [location.state]);

//   useEffect(() => {
//     if (cookies.access_token) {
//       try {
//         const decodedToken = jwt_decode(cookies.access_token);
//         if (decodedToken && decodedToken.sub1 && decodedToken.sub2 && decodedToken.sub3 && decodedToken.sub4) {
//           setUserData({
//             firstName: decodedToken.sub2,
//             lastName: decodedToken.sub3,
//             phoneNumber: decodedToken.sub1,
//             role: decodedToken.sub4,
//           });

//           setCookie("firstName", decodedToken.sub2, { path: "/", maxAge: 31536000 });
//           setCookie("lastName", decodedToken.sub3, { path: "/", maxAge: 31536000 });
//           setCookie("phoneNumber", decodedToken.sub1, { path: "/", maxAge: 31536000 });
//           setCookie("role", decodedToken.sub4, { path: "/", maxAge: 31536000 });
//         } else {
//           console.error("Invalid token structure:", decodedToken);
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, [cookies.access_token]);

//   const handleLogout = async () => {
//     try {
//       console.log("Phone number value:", cookies.access_token);

//       if (cookies.access_token) {
//         const response = await axios.post(
//           `http://localhost:8000/logout?access_token=${encodeURIComponent(cookies.access_token)}`
//         );

//         console.log(response.data);
//         toast.success("شما از حساب کاربری خود خارج شدید");

//         removeCookie("access_token", { path: "/" });

//         setUserData({ firstName: null, lastName: null, phoneNumber: null, role: null });
//       } else {
//         console.warn("No phone number found for logout");
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//       toast.error("مشکلی در خروج از حساب کاربری رخ داده است");
//     }
//   };

//   return (
//     <>
//       <div className="container" dir="rtl">
//       <Toaster className="Verify_Toaster" position="top-center" reverseOrder={false} />
//         <div className="header">
//           <nav className="header_nav">
//             <div className="header_navbar_right">
//               <ul className="header_navbar_right_ul">
//                 <li className="header_navbar_right_li">مطالب</li>
//               </ul>
//             </div>
//             <div className="header_navbar_left">
//               {!cookies.access_token ? (
//                 <Link to="/Login">
//                   <div className="header_navbar_left_div">
//                     <button className="header_navbar_left_button"> ورود | عضویت </button>
//                   </div>
//                 </Link>
//               ) : (
//                 <>
//                   <div className="user_icon" onClick={() => setShowDetails(!showDetails)}>
//                     <CiUser />
//                   </div>
//                   {showDetails && (
//                     <div className="user_details">
//                       <div className="div">شماره موبایل: {userData.phoneNumber}</div>
//                       <div className="div">نام: {userData.firstName}</div>
//                       <div className="div">نام خانوادگی: {userData.lastName}</div>
//                       <div className="div"> رول: {userData.role}</div>
//                       <Link to="/Dashboard">
//                         <div className="red">پنل کاربری</div>
//                       </Link>
//                       <button className="logout_button" onClick={handleLogout}>
//                         خروج
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </nav>
//         </div>
//         <div className="content"> </div>
//         <div className="footer"> </div>
//       </div>
//     </>
//   );
// }

// export default App;


// 2222222222222222222222222222222222222222222222222222222222222222222222222222

// import React, { useEffect, useState , useRef  } from "react";
// import "./App.css";
// import { Link, useLocation } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import jwt_decode from "jwt-decode";
// import axios from "axios";
// import { CiUser } from "react-icons/ci";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from 'react-router-dom';



// function App() {
//   const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
//   const [userData, setUserData] = useState({ firstName: null, lastName: null, phoneNumber: null, role: null });
//   const [showDetails, setShowDetails] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const toastShown = useRef(false); 

//   useEffect(() => {
//     if (location.state?.successMessage && !toastShown.current) {
//       toast.success(location.state.successMessage, { duration: 5000 });
//       toastShown.current = true; 
      
     
//       navigate(location.pathname, { replace: true });
//     }
//   }, [location.state, navigate]);

//   useEffect(() => {
//     if (cookies.access_token) {
//       try {
//         const decodedToken = jwt_decode(cookies.access_token);
//         if (decodedToken && decodedToken.sub1 && decodedToken.sub2 && decodedToken.sub3 && decodedToken.sub4) {
//           setUserData({
//             firstName: decodedToken.sub2,
//             lastName: decodedToken.sub3,
//             phoneNumber: decodedToken.sub1,
//             role: decodedToken.sub4,
//           });

//           setCookie("firstName", decodedToken.sub2, { path: "/", maxAge: 31536000 });
//           setCookie("lastName", decodedToken.sub3, { path: "/", maxAge: 31536000 });
//           setCookie("phoneNumber", decodedToken.sub1, { path: "/", maxAge: 31536000 });
//           setCookie("role", decodedToken.sub4, { path: "/", maxAge: 31536000 });
//         } else {
//           console.error("Invalid token structure:", decodedToken);
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, [cookies.access_token]);

//   const handleLogout = async () => {
//     try {
//       console.log("Phone number value:", cookies.access_token);

//       if (cookies.access_token) {
//         const response = await axios.post(
//           `http://localhost:8000/logout?access_token=${encodeURIComponent(cookies.access_token)}`
//         );

//         console.log(response.data);
//         toast.success("شما از حساب کاربری خود خارج شدید");

//         removeCookie("access_token", { path: "/" });

//         setUserData({ firstName: null, lastName: null, phoneNumber: null, role: null });
//       } else {
//         console.warn("No phone number found for logout");
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//       toast.error("مشکلی در خروج از حساب کاربری رخ داده است");
//     }
//   };

//   return (
//     <>
//       <div className="container" dir="rtl">
//       <Toaster className="Verify_Toaster" position="top-center" reverseOrder={false} />
//         <div className="header">
//           <nav className="header_nav">
//             <div className="header_navbar_right">
//               <ul className="header_navbar_right_ul">
//                 <li className="header_navbar_right_li">مطالب</li>
//               </ul>
//             </div>
//             <div className="header_navbar_left">
//               {!cookies.access_token ? (
//                 <Link to="/Login">
//                   <div className="header_navbar_left_div">
//                     <button className="header_navbar_left_button"> ورود | عضویت </button>
//                   </div>
//                 </Link>
//               ) : (
//                 <>
//                   <div className="user_icon" onClick={() => setShowDetails(!showDetails)}>
//                     <CiUser />
//                   </div>
//                   {showDetails && (
//                     <div className="user_details">
//                       <div className="div">شماره موبایل: {userData.phoneNumber}</div>
//                       <div className="div">نام: {userData.firstName}</div>
//                       <div className="div">نام خانوادگی: {userData.lastName}</div>
//                       <div className="div"> رول: {userData.role}</div>
//                       <Link to="/Dashboard">
//                         <div className="red">پنل کاربری</div>
//                       </Link>
//                       <button className="logout_button" onClick={handleLogout}>
//                         خروج
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </nav>
//         </div>
//         <div className="content"> </div>
//         <div className="footer"> </div>
//       </div>
//     </>
//   );
// }

// export default App;

// 11111111111111111111111111111111111111111111111111111111111111111111111111

// import React, { useEffect, useState } from "react";
// import "./App.css";
// import { Link } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import jwt_decode from "jwt-decode";
// import axios from "axios";
// import { CiUser } from "react-icons/ci";

// function App() {

//   const [cookies,  setCookie , removeCookie] = useCookies(['access_token']);
//   const [userData, setUserData] = useState({ firstName: null, lastName: null, phoneNumber: null, role: null });
//   const [showDetails, setShowDetails] = useState(false); 

//   useEffect(() => {
//     if (cookies.access_token) {
//       try {
//         const decodedToken = jwt_decode(cookies.access_token);
//         if (decodedToken && decodedToken.sub1 && decodedToken.sub2 && decodedToken.sub3 && decodedToken.sub4) {
//           setUserData({  
//             firstName: decodedToken.sub2, 
//             lastName: decodedToken.sub3, 
//             phoneNumber: decodedToken.sub1,
//             role: decodedToken.sub4,
//           });   
           
         
//           setCookie("firstName", decodedToken.sub2, { path: "/", maxAge: 31536000 });
//           setCookie("lastName", decodedToken.sub3, { path: "/", maxAge: 31536000 });
//           setCookie("phoneNumber", decodedToken.sub1, { path: "/", maxAge: 31536000 });
//           setCookie("role", decodedToken.sub4, { path: "/", maxAge: 31536000 });
          
  
//         } else {   
//           console.error("Invalid token structure:", decodedToken);
//         }
//       } catch (error) {
//           console.error("Error decoding token:", error);
//       }      
//     }  
//   }, [cookies.access_token]);
  
   
//   const handleLogout = async () => {
//     try {
//       console.log("Phone number value:", cookies.access_token);

//       if (cookies.access_token) {
//         const response = await axios.post(
//           `http://localhost:8000/logout?access_token=${encodeURIComponent(cookies.access_token)}`
//         );
        
//         console.log(response.data);  
//         alert("شما از حساب کاربری خود خارج شدید");

//         removeCookie("access_token", { path: '/' });

//         setUserData({ firstName: null, lastName: null, phoneNumber: null, role: null });
//       } else {
//         console.warn("No phone number found for logout");
//       } 
//     } catch (error) {
//       console.error("Error during logout:", error);
//       alert("مشکلی در خروج از حساب کاربری رخ داده است");
//     }
//   };
  

//   return (
//     <>
//       <div className="container" dir="rtl">
//         <div className="header">
//           <nav className="header_nav">
//             <div className="header_navbar_right">
//                  <ul className="header_navbar_right_ul">
//                       <li className="header_navbar_right_li"> 
//                             مطالب
//                       </li>
//                  </ul>
//             </div> 
//             <div className="header_navbar_left">
//               {!cookies.access_token ? (
//                 <Link to="/Login">
//                   <div className="header_navbar_left_div">
//                     <button className="header_navbar_left_button"> ورود | عضویت </button>
//                   </div>
//                 </Link>
//               ) : (
//                 <> 
//                   <div 
//                     className="user_icon" 
//                     onClick={() => setShowDetails(!showDetails)} 
//                   >
//                     <CiUser  />
//                   </div>
//                   {showDetails && (
//                     <div className="user_details">
//                       <div className="div">شماره موبایل: {userData.phoneNumber}</div>
//                       <div className="div">نام: {userData.firstName}</div>
//                       <div className="div">نام خانوادگی: {userData.lastName}</div>
//                       <div className="div"> رول: {userData.role}</div>
//                       <Link to="/Dashboard">
//                                <div className="red">پنل کاربری</div>
//                       </Link> 
//                       <button className="logout_button" onClick={handleLogout}>  
//                               خروج
//                       </button> 
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </nav>
//         </div>
//         <div className="content"> </div>
//         <div className="footer"> </div>
//       </div>
//     </>
//   );
// }

// export default App;







// import React, { useEffect, useState } from "react";
// import "./App.css";
// import { Link } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import jwt_decode from "jwt-decode";
// import axios from "axios";
// import { CiUser } from "react-icons/ci";

// function App() {
//   const [cookies, , removeCookie] = useCookies(['access_token']);
//   const [userData, setUserData] = useState({ firstName: null, lastName: null, phoneNumber: null });
//   const [showDetails, setShowDetails] = useState(false); 

//   useEffect(() => {
//     if (cookies.access_token) {
//       try {
//         const decodedToken = jwt_decode(cookies.access_token);
//         if (decodedToken && decodedToken.sub1 && decodedToken.sub2 && decodedToken.sub3) {
//           setUserData({  
//             firstName: decodedToken.sub2, 
//             lastName: decodedToken.sub3, 
//             phoneNumber: decodedToken.sub1,
//           });
//         } else {  
//           console.error("Invalid token structure:", decodedToken);
//         }
//       } catch (error) {
//           console.error("Error decoding token:", error);
//       }
//     }  
//   }, [cookies.access_token]);

//   const handleLogout = async () => {
//     try {
//       console.log("Phone number value:", cookies.access_token);

//       if (cookies.access_token) {
//         const response = await axios.post(
//           `http://localhost:8000/logout?access_token=${encodeURIComponent(cookies.access_token)}`
//         );
      
//         console.log(response.data);
//         alert("شما از حساب کاربری خود خارج شدید");

//         removeCookie("access_token", { path: '/' });

//         setUserData({ firstName: null, lastName: null, phoneNumber: null });
//       } else {
//         console.warn("No phone number found for logout");
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//       alert("مشکلی در خروج از حساب کاربری رخ داده است");
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const nav = document.querySelector(".header_nav");
//       if (window.pageYOffset > 36) {
//         nav.classList.add("sticky");
//       } else {
//         nav.classList.remove("sticky");
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <>
//       <div className="container" dir="rtl">
//         <div className="header">
//           <nav className="header_nav">
//              <div className="header_navbar_right">
//                 <ul className="header_navbar_right_ul">
//                   <li className="header_navbar_right_li">خانه</li>
//                   <li className="header_navbar_right_li">
//                     خدمات
//                     <ul>
//                       <li>تامین مایحتاج زندگی</li>
//                       <li>خدمات درمانی</li>
//                       <li>حمایت تحصیلی</li>
//                       <li>اشتغال زایی</li>
//                       <li>رفاهی اداری</li>
//                     </ul>
//                   </li>
//                   <li className="header_navbar_right_li">پروژه های حمایتی</li>
//                   <li className="header_navbar_right_li">همت عالی</li>
//                   <li className="header_navbar_right_li">
//                     درباره ما
//                     <ul>
//                       <li>تماس ها</li>
//                       <li>سامانه ثبت شکایات</li>
//                       <li>قوانین و مقررات</li>
//                     </ul>
//                   </li>
//                   <li className="header_navbar_right_li">
//                     فرم ها
//                     <ul>
//                       <li>فرم داوطلبی</li>
//                       <li>حامی شوید</li>
//                       <li>فرم ارزیابی</li>
//                       <li>فرم ثبت نام</li>
//                     </ul>
//                   </li>
//                 </ul>
//              </div> 
//             <div className="header_navbar_left">
//               {!cookies.access_token ? (
//                 <Link to="/Login">
//                   <div className="header_navbar_left_div">
//                     <button className="header_navbar_left_button"> ورود | عضویت </button>
//                   </div>
//                 </Link>
//               ) : (
//                 <>
//                   <div 
//                     className="user_icon" 
//                     onClick={() => setShowDetails(!showDetails)} 
//                     style={{ cursor: "pointer" }}
//                   >
//                     <CiUser size={30} />
//                   </div>
//                   {showDetails && (
//                     <div className="user_details">
//                       <div className="div">شماره موبایل: {userData.phoneNumber}</div>
//                       <div className="div">نام: {userData.firstName}</div>
//                       <div className="div">نام خانوادگی: {userData.lastName}</div>
//                       <Link to="/Dashboard">
//                           <div className="div">
//                                 حساب کاربری
//                           </div>
//                       </Link>
//                       <button className="logout_button" onClick={handleLogout}>
//                         خروج
//                       </button> 
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </nav>
//         </div>
//         <div className="content"> </div>
//         <div className="footer"> </div>
//       </div>
//     </>
//   );
// }

// export default App;



