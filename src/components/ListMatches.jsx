import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ScaleLoader, BeatLoader } from "react-spinners";


import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import { CiUser } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { FiMenu, FiX } from "react-icons/fi";





function ListMatches() {



  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingExamId, setLoadingExamId] = useState(null);
  const navigate = useNavigate();

  // start section 1

  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [userData, setUserData] = useState({ firstName: null, lastName: null, phoneNumber: null, role: null });
  const [showDetails, setShowDetails] = useState(false);
          // responsive
           const [isMenuOpen, setIsMenuOpen] = useState(false);

  // end section 1



  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/exams/list");
        setExams(response.data);
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات آزمون‌ها");
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleStartExam = async (examId, examType) => {
       setLoadingExamId(examId);

    try {
      const response = await axios.post(`http://localhost:8000/exams/${examId}`);
      const questions = response.data;

      if (!questions || questions.length === 0) {
        toast.error("هیچ سوالی برای این آزمون یافت نشد");
        return;
      }

      toast.success(`مسابقه ${examId} شروع شد`);
      navigate(`/ListMatches/Matche`, { state: { examId, examType, questions } });
    } catch (error) {
      toast.error("سوالی برای این مسابقه وجود ندارد");
      console.error("Error starting exam:", error);
    } finally {
      setLoadingExamId(null);
    }

  };



  //  start section 1


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
       

        
        const handleLogout  = async () => {
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

        // end section 1



 

  return (
          <div className="ListMatches_container" dir="rtl">
              <Toaster className="Notification_Toaster" position="top-center" reverseOrder={false} />

                {/* start section 1 */}

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


                  {/*  end section 1 */}



            {loading ? (
             <div className="Loader_Container">
                 <ScaleLoader color=" #0073e6" height={25}   width={3} />
              </div>
            ) : exams.length > 0 ? (
              <div className="ListMatches_exams_list">
                {exams.map((exam) => (
                  <div key={exam.ID} className="ListMatches_exam_card">
                    <header className="ListMatches_exam_header">
                      <p className="ListMatches_exam_title">
                         مسابقه : <span className="ListMatches_exam_type_span">{exam.Title}</span>
                      </p>
                    </header>

                    <section className="ListMatches_exam_info">
                      <p className="ListMatches_exam_type">
                               نوع مسابقه : <span className="ListMatches_exam_type_span">
                                 {exam.Type === "test" ? "تستی" : "تشریحی"}
                                     </span>
                      </p>
                    </section>

                    <section className="ListMatches_articles_section">
                      <h4 className="ListMatches_exam_title_h">مقالات مرتبط</h4>

                      <ul className="ListMatches_articles_list">
                        {exam.Articles.length > 0 ? (
                          exam.Articles.map((article) => (
                            <li key={article.ID} className="ListMatches_article_item">
                              <article className="ListMatches_article_card">
                                <header className="ListMatches_article_header">
                                  <p className="ListMatches_article_id">
                                      کد مقاله: <span className="ListMatches_article_id_span">{article.ID}</span>
                                  </p>
                                </header>
                                <footer className="ListMatches_article_footer">
                                  <p className="ListMatches_article_id">
                                      عنوان مقاله: <span className="ListMatches_article_id_span">{article.Title}</span>
                                  </p>
                                </footer>
                              </article>
                            </li>
                          ))
                        ) : (
                          <p className="ListMatches_no_articles">بدون مقاله</p>
                        )}
                      </ul>
                    </section>

                    <footer className="ListMatches_exam_footer">
                      <button
                        className="ListMatches_start_exam_button"
                        onClick={() => handleStartExam(exam.ID, exam.Type)}
                        disabled={loadingExamId === exam.ID}
                      >
                        {loadingExamId === exam.ID ? (
                          <BeatLoader className="ListMatches_BeatLoader" />
                        ) : (
                          "شروع آزمون"
                        )}
                      </button>
                    </footer>
                  </div>
                ))}
              </div>
            ) : (
              <p className="ListMatches_no_exams_message">هیچ آزمونی یافت نشد</p>
            )}
          </div>
  );
}

export default ListMatches;



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { ScaleLoader, BeatLoader } from "react-spinners";

// function ListMatches() {
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingExamId, setLoadingExamId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/exams/list");
//         setExams(response.data);
//       } catch (error) {
//         toast.error("خطا در دریافت اطلاعات آزمون‌ها");
//         console.error("Error fetching exams:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExams();
//   }, []);

//   const handleStartExam = async (examId, examType) => {
//        setLoadingExamId(examId);

//     try {
//       const response = await axios.post(`http://localhost:8000/exams/${examId}`);
//       const questions = response.data;

//       if (!questions || questions.length === 0) {
//         toast.error("هیچ سوالی برای این آزمون یافت نشد");
//         return;
//       }

//       toast.success(`آزمون ${examId} شروع شد`);
//       navigate(`/ListMatches/Matche`, { state: { examId, examType, questions } });
//     } catch (error) {
//       toast.error("خطا در شروع آزمون");
//       console.error("Error starting exam:", error);
//     } finally {
//       setLoadingExamId(null);
//     }
//   };

//   return (
//           <div className="ListMatches_container">
//             <Toaster className="ListMatches_Toaster" position="top-center" reverseOrder={false} />

//             {loading ? (
//               <div className="ListMatches_loader_container">
//                 <ScaleLoader className="ListMatches_ScaleLoader" />
//               </div>
//             ) : exams.length > 0 ? (
//               <div className="ListMatches_exams_list">
//                 {exams.map((exam) => (
//                   <div key={exam.ID} className="ListMatches_exam_card">
//                     <header className="ListMatches_exam_header">
//                       <h3 className="ListMatches_exam_title">{exam.Title}</h3>
//                     </header>

//                     <section className="ListMatches_exam_info">
//                       <p className="ListMatches_exam_type">
//                         نوع آزمون: <span className="ListMatches_exam_type_span">{exam.Type}</span>
//                       </p>
//                     </section>

//                     <section className="ListMatches_articles_section">
//                       <h4 className="ListMatches_exam_title_h">مقالات مرتبط</h4>

//                       <ul className="ListMatches_articles_list">
//                         {exam.Articles.length > 0 ? (
//                           exam.Articles.map((article) => (
//                             <li key={article.ID} className="ListMatches_article_item">
//                               <article className="ListMatches_article_card">
//                                 <header className="ListMatches_article_header">
//                                   <h5 className="ListMatches_article_title">{article.Title}</h5>
//                                 </header>
//                                 <footer className="ListMatches_article_footer">
//                                   <p className="ListMatches_article_id">
//                                     آیدی مقاله: <span className="ListMatches_article_id_span">{article.ID}</span>
//                                   </p>
//                                 </footer>
//                               </article>
//                             </li>
//                           ))
//                         ) : (
//                           <p className="ListMatches_no_articles">بدون مقاله</p>
//                         )}
//                       </ul>
//                     </section>

//                     <footer className="ListMatches_exam_footer">
//                       <button
//                         className="ListMatches_start_exam_button"
//                         onClick={() => handleStartExam(exam.ID, exam.Type)}
//                         disabled={loadingExamId === exam.ID}
//                       >
//                         {loadingExamId === exam.ID ? (
//                           <BeatLoader className="ListMatches_BeatLoader" />
//                         ) : (
//                           "شروع آزمون"
//                         )}
//                       </button>
//                     </footer>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="ListMatches_no_exams_message">هیچ آزمونی یافت نشد</p>
//             )}
//           </div>
//   );
// }

// export default ListMatches;



