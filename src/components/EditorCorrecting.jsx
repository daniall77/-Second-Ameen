import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { BounceLoader , BeatLoader } from "react-spinners";

function EditorCorrecting() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, phoneNumber } = location.state || {};
  const [cookies] = useCookies(["access_token"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/answers/descriptive/${examId}/${phoneNumber}`, {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        });

        setStudentData(response.data.data[0]);

        const initialGrades = {};
        response.data.data[0]?.questions.forEach(q => {
          initialGrades[q.question_number] = "";
        });
        setGrades(initialGrades);
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("هیچ پاسخی برای این آزمون یافت نشد");
        } else {
          toast.error("خطا در دریافت پاسخ‌های دانش‌آموز");
        }
        console.error("خطا:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [examId, phoneNumber]);

  const handleGradeChange = (questionNumber, value) => {
    setGrades(prevGrades => ({
      ...prevGrades,
      [questionNumber]: value,
    }));
  };

  const handleFinishCorrection = async () => {
    setIsSubmitting(true);

    const formattedGrades = Object.entries(grades).map(([question_number, score]) => ({
      question_number: parseInt(question_number),
      score: parseFloat(score),
    }));

    try {
      await axios.post(`http://localhost:8000/grade/descriptive/${examId}/${phoneNumber}`, formattedGrades, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });

      toast.success("نمره ثبت شد");
      setTimeout(() => {
        navigate("/Dashboard/ListExam");
      }, 1000);
    } catch (error) {
      toast.error("خطا در ارسال نمرات!");
      console.error("خطا:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
          <div className="AdminCorrecting_container">
                <Toaster className="AdminCorrecting_Toaster"  position="top-center" reverseOrder={false} />

                <header className="AdminCorrecting_header">
                    <h2 className="AdminCorrecting_header_h" >پاسخ‌های دانش‌آموز</h2>
                </header>

                {isLoading ? (
                  <div className="AdminCorrecting_loader_container">
                      <BounceLoader className="AdminCorrecting_BounceLoader" />
                  </div>
                ) : studentData ? (
                <section className="AdminCorrecting_student_info_section">
                    <header className="AdminCorrecting_student_header">
                          <h3 className="AdminCorrecting_student_header_h">{studentData.firstname} {studentData.lastname}</h3>
                          <p className="AdminCorrecting_student_header_p"><strong className="AdminCorrecting_student_header_strong">شماره تلفن:</strong> {studentData.phone_number}</p>
                    </header>

                    <h3 className="AdminCorrecting_student_h">سوالات و پاسخ‌ها:</h3>

                    <div className="AdminCorrecting_questions_section">
                          {studentData.questions.map((q, index) => (
                          <article key={index} className="AdminCorrecting_question_card">
                              <header className="AdminCorrecting_question_header">
                                <p className="AdminCorrecting_question_p">
                                    <strong className="AdminCorrecting_question_strong">سوال {q.question_number}:</strong> {q.question_text} 
                                    <span className="AdminCorrecting_question_score"> (نمره کل: {q.question_score})</span>
                                </p>
                              </header>

                              <p className="AdminCorrecting_p" >
                                <strong className="AdminCorrecting_strong">پاسخ:</strong> {studentData.answers.find(a => a.question_number === q.question_number)?.answer_text || "بدون پاسخ"}
                              </p>

                              <div className="AdminCorrecting_grade_input">
                                    <label className="AdminCorrecting_grade_label"><strong className="AdminCorrecting_grade_strong" >نمره:</strong></label>
                                        <input
                                          className="AdminCorrecting_grade_input"
                                          type="number"
                                          min="0"
                                          max={q.question_score}
                                          value={grades[q.question_number]}
                                          onChange={(e) => handleGradeChange(q.question_number, e.target.value)}
                                          placeholder={`حداکثر ${q.question_score}`}
                                        />
                              </div>
                          </article>
                        ))}
                    </div>

                      <footer className="AdminCorrecting_footer">
                        <button className="AdminCorrecting_finish_button" onClick={handleFinishCorrection} disabled={isSubmitting}>
                          {isSubmitting ? <BeatLoader className="AdminCorrecting_BeatLoader" /> : "پایان تصحیح"}
                        </button>
                      </footer>
                </section>
              ) : (
                  <p className="AdminCorrecting_no_answers_message">هیچ پاسخی برای این آزمون یافت نشد</p>
              )}
          </div>
  );
}

export default EditorCorrecting;



// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { useCookies } from "react-cookie";

// function EditorCorrecting() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { examId, phoneNumber } = location.state || {}; 
//   const [cookies] = useCookies(["access_token"]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [studentData, setStudentData] = useState(null);
//   const [grades, setGrades] = useState({}); 

//   useEffect(() => {


//     const fetchAnswers = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(`http://localhost:8000/answers/descriptive/${examId}/${phoneNumber}`, {
//           headers: { Authorization: `Bearer ${cookies.access_token}` },
//         });

//         setStudentData(response.data.data[0]); 

        
//         const initialGrades = {};
//         response.data.data[0]?.questions.forEach(q => {
//           initialGrades[q.question_number] = "";
//         });
//         setGrades(initialGrades);
//       } catch (error) {
//         if (error.response?.status === 404) {
//           toast.error("هیچ پاسخی برای این آزمون یافت نشد");
//         } else {
//           toast.error("خطا در دریافت پاسخ‌های دانش‌آموز");
//         }
//         console.error("خطا:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAnswers();
//   }, [examId, phoneNumber]);

//   const handleGradeChange = (questionNumber, value) => {
//     setGrades(prevGrades => ({
//       ...prevGrades,
//       [questionNumber]: value,
//     }));
//   };

//   const handleFinishCorrection = async () => {
//     const formattedGrades = Object.entries(grades).map(([question_number, score]) => ({
//       question_number: parseInt(question_number),
//       score: parseFloat(score),
//     }));

//     try {
//       const response = await axios.post(`http://localhost:8000/grade/descriptive/${examId}/${phoneNumber}`, formattedGrades, {
//         headers: { Authorization: `Bearer ${cookies.access_token}` },
//       });

//       toast.success("نمره ثبت شد");
//       navigate("/Dashboard/ListExam");
//     } catch (error) {
//       toast.error(" خطا در ارسال نمرات!");
//       console.error(" خطا:", error);
//     }
//   };

//   return (
//     <div className="AdminCorrecting_container">
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2>پاسخ‌های دانش‌آموز</h2>

//       {isLoading ? (
//         <p> در حال بارگیری...</p>
//       ) : studentData ? (
//         <div className="student-info">
//           <h3> {studentData.firstname} {studentData.lastname}</h3>
//           <p> شماره تلفن: {studentData.phone_number}</p>
//           <h3> سوالات و پاسخ‌ها:</h3>
//           {studentData.questions.map((q, index) => (
//             <div key={index} className="question-answer">
//               <p><strong> سوال {q.question_number}:</strong> {q.question_text} (نمره کل: {q.question_score})</p>
//               <p><strong> پاسخ:</strong> {studentData.answers.find(a => a.question_number === q.question_number)?.answer_text || " بدون پاسخ"}</p>
              
              
//               <label> نمره:</label>
//               <input 
//                 type="number"
//                 min="0"
//                 max={q.question_score}
//                 value={grades[q.question_number]}
//                 onChange={(e) => handleGradeChange(q.question_number, e.target.value)}
//                 placeholder={`حداکثر ${q.question_score}`}
//               />
//             </div>
//           ))}
//           <button className="finish-btn" onClick={handleFinishCorrection}> پایان تصحیح</button>
//         </div>
//       ) : (
//         <p> هیچ پاسخی برای این آزمون یافت نشد.</p>
//       )}
//     </div>
//   );
// }

// export default EditorCorrecting;


