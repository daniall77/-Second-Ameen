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
import { FiMenu, FiX } from "react-icons/fi";
import Default from "/image/Default.jpg";


   function App() {

       const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
       const [userData, setUserData] = useState({ firstName: null, lastName: null, phoneNumber: null, role: null });
       const [showDetails, setShowDetails] = useState(false);
       const location = useLocation();
       const toastShown = useRef(false);
       const [articles, setArticles] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
       const [visibleArticles, setVisibleArticles] = useState(5);
        // responsive
           const [isMenuOpen, setIsMenuOpen] = useState(false);


           useEffect(() => {
             if (location.state?.successMessage && !toastShown.current) {
               toast.success(location.state.successMessage, { duration: 1000 });
               toastShown.current = true;
             }
           }, [location.state]);


             useEffect(() => {
             const handleScroll = () => {
               const nav = document.querySelector(".Main_Navigation");
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


           const showMoreArticles = () => {
            setVisibleArticles((prev) => prev + 5);
          };


         return (
             <>
               <div className="Container" dir="rtl" >
                   <Toaster className="Notification_Toaster" position="top-center" reverseOrder={false} />
                   <header className="Main_Header">
                         <nav className="Main_Navigation">
                 
                           <div className="Navigation_Right">
                             <ul className="Nav_List">
                               <li className="Nav_Item">
                                      <Link to="/" className="Nav_Item_link">خانه</Link>
                               </li>
                               <li className="Nav_Item">درباره ما</li>
                               <li className="Nav_Item">
                                 <Link to="/ListMatches" className="Nav_Item_link">مسابقات</Link>
                               </li>
                             </ul>
                           </div>
                   
                           <div className="Menu_Icon" onClick={() => setIsMenuOpen(true)}>
                             <FiMenu className="FiMenu" />
                           </div>
                           <div className="Navigation_Left">
                             {!cookies.access_token ? (
                               <Link to="/Login">
                                 <button className="Button_Login">ورود | عضویت</button>
                               </Link>
                             ) : (
                               <>
                                 <div className="User_Icon" onClick={() => setShowDetails(!showDetails)}>
                                   <CiUser className="CiUser" />
                                 </div>
                                 {showDetails && (
                                   <div className="User_Details_Dropdown">
                                     <div className="User_Welcome_Message">
                                          <strong className="User_Welcome_strong" >{userData.firstName}  {userData.lastName} خوش آمدی  </strong> 
                                     </div>
                                     <div className="User_Panel_Link">
                                       <AiOutlineHome className="User_Panel_Icon" />
                                       <Link to="/Dashboard" className="User_link" >
                                         <div className="User_Welcome_Message" ><strong className="User_Welcome_strong" >پنل کاربری</strong></div>
                                       </Link>
                                     </div>
                                     <div className="User_Logout">
                                       <IoExitOutline className="User_Panel" />
                                       <button className="Logout_Button" onClick={handleLogout}>
                                               خروج
                                       </button>
                                     </div>
                                   </div>
                                 )}
                               </>
                             )}
                           </div>
                         </nav>
       
                       {isMenuOpen && (
                         <div className="Sidebar_Overlay"  onClick={() => setIsMenuOpen(false)}>
                           <div className="Sidebar_Menu"   onClick={(e) => e.stopPropagation()}>
                             <FiX className="Close_Icon" onClick={() => setIsMenuOpen(false)} />
                             <ul className="Sidebar_List">
                               <li className="Sidebar_Item">
                                    <Link to="/" className="Sidebar_Item Nav_Item_link">خانه</Link>
                               </li>
                               <li className="Sidebar_Item">درباره ما</li>
                               <li className="Sidebar_Item">
                                   <Link to="/ListMatches" className="Sidebar_Item Nav_Item_link">مسابقات</Link>
                               </li>
                             </ul>
                           </div>
                         </div>
                       )}
                 </header>

               
                   <main className="Content_Wrapper">
                     {loading ? (
                       <div className="Loader_Container">
                         <ScaleLoader color=" #0073e6" height={25}   width={3} />
                       </div>
                     ) : error ? (
                       <p className="Error_Message">{error}</p>
                     ) : (
                       <section className="Articles_Section">
                         {articles.slice(0, visibleArticles).map((article) => (
                           <article key={article.id} className="Article_Card">
                               <h2 className="Article_Title"><strong className="Article_Title">{article.title}</strong></h2>
                              <div className="Article_section_one">
                                    <div className="Article_section_one_right">
                                          <img
                                            src={article.photo ? `http://localhost:8000/articles/${article.photo}` : Default}
                                            alt="Article"
                                            className="Article_Image"
                                          />
                                    </div>
                                    <div className="Article_section_one_left">
                                          <p className="Article_Author">کد مقاله: <strong className="Article_strong" >{article.id}</strong></p>
                                          <p className="Article_Author">نویسنده: <strong className="Article_strong" >{article.author_id}</strong></p>
                                          <p className="Article_Date">تاریخ ایجاد: <strong className="Article_strong" >{article.created_at}</strong></p>
                                          {article.updated_at && (
                                            <p className="Article_Update_Date">آخرین بروزرسانی: <strong className="Article_strong">{article.updated_at}</strong></p>
                                          )}
                                          <p className="Article_Categories">
                                            دسته‌بندی‌ها: <strong className="Article_strong" >
                                              {article.subcategory && Object.keys(article.subcategory).length > 0 
                                                  ? Object.entries(article.subcategory)
                                                  .map(([key , values]) =>  values.length > 0 
                                                    ? `${key}-${values.join("-")}` : key )
                                                    .join(" | ")
                                                  : 
                                                  "دسته بندی نشده"
                                              }
                                            </strong>
                                          </p>
                                     </div>
                               </div>
                               <div className="Article_section_two">
                                       <div className="Article_Content" dangerouslySetInnerHTML={{ __html: article.text }}></div>
                               </div>
                           </article>
                         ))}

                         {visibleArticles < articles.length && (
                              <button className="AdminConfirmContent_show_more" onClick={showMoreArticles}>
                                        + بیشتر
                              </button>
                            )}
                       </section>
                     )}


                   </main>
                 </div>
            </>
       );
}
export default App; 


