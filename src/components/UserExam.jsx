import React from "react";



function UserExam() {


  return (
    <div className="UserExam_container">
        
    </div>
  );
}

export default UserExam;





// import React, { useState, useEffect } from "react";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { ScaleLoader, BeatLoader } from "react-spinners";
// import { RxCross2 } from "react-icons/rx";


// function UserExam() {
//   const [cookies] = useCookies(["access_token"]);
//   const [exams, setExams] = useState([]);
//   const [userExamIds, setUserExamIds] = useState([]);
//   const [error, setError] = useState("");
//   const [loadingPage, setLoadingPage] = useState(true);
//   const [loadingAction, setLoadingAction] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [scoreData, setScoreData] = useState(null);
//   const [isDescriptive, setIsDescriptive] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/exams/list", {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         });
//         setExams(response.data);
//         setError("");
//       } catch (err) {
//         console.error("Error fetching exams:", err);
//         if (err.response?.status === 403) {
//           setError("شما مجاز به مشاهده این اطلاعات نیستید");
//         } else {
//           setError("خطایی در دریافت اطلاعات رخ داد");
//         }
//       } finally {
//         setLoadingPage(false);
//       }
//     };

//     const fetchUserExamIds = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/user/exam/list", {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         });
//         setUserExamIds(response.data.data);
//       } catch (err) {
//         console.error("Error fetching user exams:", err);
//         setUserExamIds([]);
//       }
//     };

//     fetchExams();
//     fetchUserExamIds();
//   }, [cookies.access_token]);

//   const handleStartExam = async (exam) => {
//     setLoadingAction(`start-${exam.ID}`);
//     try {
//       const response = await axios.post(
//         `http://localhost:8000/exams/${exam.ID}`,
//         { exam_id: exam.ID },
//         {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         }
//       );

//       navigate("/Dashboard/Exam/Question", {
//         state: {
//           examId: exam.ID,
//           timer: exam.Timer,
//           description: exam.Description,
//           questions: response.data,
//         },
//       });
//     } catch (err) {
//         console.error("Error starting exam:", err);
//         if (err.response?.status === 403) {
//           toast.error("شما مجاز به شروع این آزمون نیستید.");
//         } else if (err.response?.status === 404) {
//           toast.error("سوالاتی برای این آزمون یافت نشد.");
//         } else {
//           toast.error("خطایی در شروع آزمون رخ داد.");
//         }
//     } finally {
//       setLoadingAction(null);
//     }
//   };

//   const handleViewResult = async (exam) => {
//     setLoadingAction(`result-${exam.ID}`);
//     try {
//       let response;
//       if (exam.Description === "descriptive") {
//         response = await axios.get(
//           `http://localhost:8000/score/descriptive/${exam.ID}`,
//           {
//             headers: {
//               Authorization: `Bearer ${cookies.access_token}`,
//             },
//           }
//         );
//         setScoreData({ total_score: response.data.total_score });
//         setIsDescriptive(true);
//       } else {
//         response = await axios.get(
//           `http://localhost:8000/score/test/${exam.ID}`,
//           {
//             headers: {
//               Authorization: `Bearer ${cookies.access_token}`,
//             },
//           }
//         );
//         setScoreData(response.data.data);
//         setIsDescriptive(false);
//       }
//       setShowModal(true);
//     } catch (err) {
//       console.error("Error fetching score:", err);
//       toast.error("خطایی در دریافت نمره آزمون رخ داده است.");
//     } finally {
//       setLoadingAction(null);
//     }
//   };

//   return (
//     <div className="UserExam_container">
//       <Toaster position="top-center" reverseOrder={false} />
      
//       {loadingPage ? (
//         <div className="UserExam_container_loader">
//           <ScaleLoader  />
//         </div>
//       ) : (
//         <>
//           <h2 className="UserExam_container_h">نمایش آزمون‌ها</h2>
//           {error ? (
//             <p className="UserExam_container_p">{error}</p>
//           ) : exams.length > 0 ? (
//             <div className="UserExam_div">
//               {exams.map((exam) => (
//                 <div key={exam.ID} className="UserExam_div_text">
//                   <h3 className="UserExam_div_h">{exam.Title}</h3>
//                   <p className="UserExam_div_des">توضیحات: {exam.Description}</p>
//                   <p className="UserExam_div_ti">مدت زمان: {exam.Timer} دقیقه</p>
//                   <div className="UserExam_buttons">
//                     <button
//                       className="UserExam_start_button"
//                       onClick={() => handleStartExam(exam)}
//                       disabled={userExamIds.includes(exam.ID) || loadingAction}
//                     >
//                       {loadingAction === `start-${exam.ID}` ? (
//                         <BeatLoader  />
//                       ) : (
//                         "شروع آزمون"
//                       )}
//                     </button>
//                     <button
//                       className="UserExam_result_button"
//                       onClick={() => handleViewResult(exam)}
//                       disabled={!userExamIds.includes(exam.ID) || loadingAction}
//                     >
//                       {loadingAction === `result-${exam.ID}` ? (
//                         <BeatLoader />
//                       ) : (
//                         "مشاهده نتیجه"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="UserExam_nama">هیچ آزمونی برای نمایش وجود ندارد</p>
//           )}
//         </>
//       )}

//       {showModal && (
//         <div className="UserExam_modal_overlay">
//           <div className="UserExam_modal_content">
//             <h3 className="UserExam_modal_h">نتیجه آزمون</h3>
//             {scoreData ? (
//               isDescriptive ? (
//                 <p className="UserExam_modal_p">نمره کل: {scoreData.total_score}</p>
//               ) : (
//                 <>
//                   <p className="UserExam_modal_p">تعداد سوالات: {scoreData.total_questions}</p>
//                   <p className="UserExam_modal_p">تعداد پاسخ‌های صحیح: {scoreData.correct_answers}</p>
//                   <p className="UserExam_modal_p">درصد نمره: {scoreData.score_percentage.toFixed(2)}%</p>
//                 </>
//               )
//             ) : (
//               <p className="UserExam_modal_p">در حال بارگذاری نمره...</p>
//             )}
//             <div className="UserExam_modal_div">
//                    <button  className="UserExam_modal_div_button"  onClick={() => setShowModal(false)}>
//                          <RxCross2  className="UserExam_RxCross2" />
//                     </button>
//             </div>
            
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserExam;












// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import toast, { Toaster } from "react-hot-toast";
// import { BounceLoader, BeatLoader } from "react-spinners";

// function UserQuestion() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { examId, timer, description, questions } = location.state || {};
//   const [remainingTime, setRemainingTime] = useState(timer * 60);
//   const [testAnswers, setTestAnswers] = useState({});
//   const [descriptiveAnswers, setDescriptiveAnswers] = useState({});
//   const [cookies] = useCookies(["access_token"]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true); 

//   const testAnswersRef = useRef(testAnswers);
//   const descriptiveAnswersRef = useRef(descriptiveAnswers);

//   useEffect(() => {
//     testAnswersRef.current = testAnswers;
//   }, [testAnswers]);

//   useEffect(() => {
//     descriptiveAnswersRef.current = descriptiveAnswers;
//   }, [descriptiveAnswers]);

//   useEffect(() => {
//     if (!questions) return;

//     setTimeout(() => {
//       setLoading(false); 
//     }, 500);

//     console.log("Initial state loaded:", { examId, timer, description, questions });

//     const countdown = setInterval(() => {
//       setRemainingTime((prevTime) => {
//         if (prevTime <= 1) {
//           clearInterval(countdown);
//           console.log("Timer ended. Calling handleAutoFinishExam.");
//           handleAutoFinishExam();
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => {
//         console.log("Timer cleared.");
//         clearInterval(countdown);
//       };
//     }, [questions]);

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   const handleTestAnswerChange = (questionNumber, selectedOptionNumber) => {
//     setTestAnswers((prevAnswers) => {
//       const updatedAnswers = {
//         ...prevAnswers,
//         [questionNumber]: selectedOptionNumber,
//       };
//       console.log("Updated test answers:", updatedAnswers);
//       return updatedAnswers;
//     });
//   };

//   const handleDescriptiveAnswerChange = (questionNumber, answerText) => {
//     setDescriptiveAnswers((prevAnswers) => {
//       const updatedAnswers = {
//         ...prevAnswers,
//         [questionNumber]: answerText,
//       };
//       console.log("Updated descriptive answers:", updatedAnswers);
//       return updatedAnswers;
//     });
//   };

//   const submitAnswers = async () => {
//     const currentTestAnswers = { ...testAnswersRef.current };
//     const currentDescriptiveAnswers = { ...descriptiveAnswersRef.current };

//     console.log("Submitting answers...");
//     console.log("Test answers to submit:", currentTestAnswers);
//     console.log("Descriptive answers to submit:", currentDescriptiveAnswers);

//     try {
//       const testAnswersArray = Object.entries(currentTestAnswers).map(
//         ([questionNumber, selectedOptionNumber]) => ({
//           question_number: parseInt(questionNumber, 10),
//           selected_option: selectedOptionNumber,
//         })
//       );

//       if (testAnswersArray.length > 0) {
//         await axios.post(
//           "http://localhost:8000/answers/test",
//           {
//             exam_id: examId,
//             answers: testAnswersArray,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${cookies.access_token}`,
//             },
//           }
//         );
//       }

//       const descriptiveAnswersArray = Object.entries(currentDescriptiveAnswers).map(
//         ([questionNumber, answerText]) => ({
//           question_number: parseInt(questionNumber, 10),
//           answer_text: answerText,
//         })
//       );

//       if (descriptiveAnswersArray.length > 0) {
//         await axios.post(
//           "http://localhost:8000/answers/descriptive",
//           {
//             exam_id: examId,
//             answers: descriptiveAnswersArray,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${cookies.access_token}`,
//             },
//           }
//         );
//       }

//       return true;
//     } catch (error) {
//       console.error("Error submitting answers:", error);
//       toast.error("خطایی در ارسال پاسخ‌ها رخ داد.");
//       return false;
//     }
//   };

//   const handleFinishExam = async () => {
//     if (isSubmitting) {
//       console.log("Already submitting. Exiting handleFinishExam.");
//       return;
//     }
//     setIsSubmitting(true);
//     const success = await submitAnswers();
//     if (success) {
//       toast.success("پاسخ‌های شما با موفقیت ارسال شد.");
//       navigate("/Dashboard/Exam");
//     }
//   };


//   const handleAutoFinishExam = async () => {
//     console.log("Auto finish triggered.");
//     if (isSubmitting) {
//       console.log("Already submitting. Exiting auto finish.");
//       return;
//     }
//     setIsSubmitting(true);

//     const success = await submitAnswers();
//     if (success) {
//       toast.success("زمان آزمون به پایان رسید و پاسخ‌ها ارسال شدند.");
//       navigate("/Dashboard/Exam");
//     }
//   };

//   const isTestQuestion = (question) => question.option_1;

//   return (
//     <div className="UserQuestion_container">
//       <Toaster position="top-center" reverseOrder={false} />

//       {loading ? (
//         <div className="UserQuestion_loading">
//           <BounceLoader />
//         </div>
//       ) : (
//         <>

//         <div className="UserQuestion_div">
//           <h2 className="UserQuestion_heading">آزمون شماره {examId}</h2>
//           <p className="UserQuestion_description">توضیحات: {description}</p>
//           <p className="UserQuestion_timer">زمان باقی‌مانده: {formatTime(remainingTime)}</p>

//           <div className="UserQuestion_questions">
//             {questions.map((question, index) => (
//               <div
//                 key={index}
//                 className={`UserQuestion_question ${
//                   isTestQuestion(question) ? "UserQuestion_test" : "UserQuestion_descriptive"
//                 }`}
//               >
//                 <h3 className="UserQuestion_questions_h">
//                   سوال {index + 1}: {question.question_text}
//                 </h3>
//                 {isTestQuestion(question) ? (
//                   <ul className="UserQuestion_questions_ul">
//                     {[question.option_1, question.option_2, question.option_3, question.option_4].map(
//                       (option, idx) => (
//                         <li key={idx} className="UserQuestion_questions_li" >
//                           <label className="UserQuestion_questions_label" >
//                             <input
//                               className="UserQuestion_questions_input"
//                               type="radio"
//                               name={`question_${question.question_number}`}
//                               value={idx + 1}
//                               onChange={() =>
//                                 handleTestAnswerChange(question.question_number, idx + 1)
//                               }
//                             />
//                             {idx + 1}. {option}
//                           </label>
//                         </li>
//                       )
//                     )}
//                   </ul>
//                 ) : (
//                   <textarea
//                     className="UserQuestion_questions_textarea"
//                     placeholder="پاسخ خود را اینجا بنویسید..."
//                     onChange={(e) =>
//                       handleDescriptiveAnswerChange(question.question_number, e.target.value)
//                     }
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="UserQuestion_finish_div">
//                    <button className="UserQuestion_finish_button" onClick={handleFinishExam} disabled={isSubmitting}>
//                         {isSubmitting ? <BeatLoader /> : "پایان آزمون"}
//                    </button>
//           </div>


//        </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default UserQuestion;






