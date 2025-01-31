import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";
import { ScaleLoader, BeatLoader, ClipLoader } from "react-spinners";

function AdminCorrecting() {
  const { examId } = useParams();
  const [cookies] = useCookies(["access_token"]);
  const [data, setData] = useState([]);
  const [grades, setGrades] = useState({});
  const [gradedStudents, setGradedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(null);
  const [addingToTable, setAddingToTable] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnswersAndQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/answers/descriptive/${examId}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          }
        );
        setData(response.data.data);
        setError("");
      } catch (err) {
        console.error("خطا در دریافت اطلاعات:", err);
        setError("هیچ پاسخی برای این آزمون یافت نشد");
        toast.error("هیچ پاسخی برای این آزمون یافت نشد");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswersAndQuestions();
  }, [examId, cookies.access_token]);

  const handleGradeChange = (userId, questionNumber, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [userId]: {
        ...prevGrades[userId],
        [questionNumber]: value,
      },
    }));
  };

  const handleSubmitGrades = async (userId, firstname, lastname, phone) => {
    const userGrades = Object.entries(grades[userId] || {}).map(
      ([questionNumber, score]) => ({
        question_number: Number(questionNumber),
        score: Number(score),
      })
    );

   
    const userQuestions = data.find((item) => item.user_id === userId)?.questions || [];
    const isAllGraded = userQuestions.every(
      (q) => grades[userId]?.[q.question_number] !== undefined && grades[userId]?.[q.question_number] !== ""
    );

    if (!isAllGraded) {
      toast.error("قرار دادن نمره برای هر فیلد الزامی است.");
      return;
    }

    setSubmittingUser(userId); 

    try {
      const response = await axios.post(
        `http://localhost:8000/grade/descriptive/${examId}/${userId}`,
        userGrades,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );

      const totalScore = response.data.data.total_score;

      setData((prevData) => prevData.filter((item) => item.user_id !== userId));

      setAddingToTable(true); 

      setTimeout(() => {
        setGradedStudents((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            firstname,
            lastname,
            phone,
            score: totalScore,
          },
        ]);
        setAddingToTable(false);
      }, 1000);

      toast.success("نمرات با موفقیت ثبت شد.");
    } catch (err) {
      console.error("خطا در ثبت نمرات:", err);
      toast.error("مشکلی در ثبت نمرات رخ داده است.");
    } finally {
      setSubmittingUser(null);
    }
  };

  return (
    <div className="AdminCorrecting_container">
      <Toaster position="top-center" reverseOrder={false} />

      <h2>تصحیح پاسخ‌های آزمون {examId}</h2>

      {loading ? (
        <div className="loader-container">
          <ScaleLoader />
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="AdminCorrecting_content">
          {data.length > 0 ? (
            <ul>
              {data.map((item) => (
                <li key={item.user_id} className="AdminCorrecting_user">
                  <h3>
                    دانشجو: {item.firstname} {item.lastname} - شماره تماس: {item.phone_number}
                  </h3>
                  <div className="AdminCorrecting_questions_answers">
                    {item.questions.map((q) => (
                      <div key={q.question_number} className="AdminCorrecting_question">
                        <p>
                          <strong>سؤال {q.question_number}: </strong>
                          {q.question_text}
                        </p>
                        <p>
                          <strong>نمره کل سؤال: </strong> {q.question_score}
                        </p>
                        {item.answers
                          .filter((a) => a.question_number === q.question_number)
                          .map((ans) => (
                            <div key={ans.question_number} className="AdminCorrecting_answer">
                              <p>
                                <strong>پاسخ: </strong> {ans.answer_text}
                              </p>
                              <input
                                className="AdminCorrecting_score_input"
                                type="number"
                                placeholder="نمره دانشجو"
                                value={grades[item.user_id]?.[q.question_number] || ""}
                                onChange={(e) =>
                                  handleGradeChange(item.user_id, q.question_number, e.target.value)
                                }
                              />
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                  <button
                    className="AdminCorrecting_submit_button"
                    onClick={() =>
                      handleSubmitGrades(item.user_id, item.firstname, item.lastname, item.phone_number)
                    }
                    disabled={submittingUser === item.user_id}
                  >
                    {submittingUser === item.user_id ? <BeatLoader /> : "ثبت نمرات"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>هیچ پاسخی برای این آزمون یافت نشد</p>
          )}
        </div>
      )}

      {gradedStudents.length > 0 && (
        <div className="graded-table">
          <h3>نمرات ثبت‌شده</h3>
           <table>
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>نام</th>
                  <th>نام خانوادگی</th>
                  <th>شماره موبایل</th>
                  <th>نمره</th>
                </tr>
              </thead>
              <tbody>
                {addingToTable ? (
                  <tr>
                    <td>
                      <ClipLoader />
                    </td>
                  </tr>
                ) : (
                  gradedStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.firstname}</td>
                      <td>{student.lastname}</td>
                      <td>{student.phone}</td>
                      <td>{student.score}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

        </div>
      )}
    </div>
  );
}

export default AdminCorrecting;



// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import toast, { Toaster } from "react-hot-toast";

// function AdminCorrecting() {
//   const { examId } = useParams(); 
//   const [cookies] = useCookies(["access_token"]);
//   const [data, setData] = useState([]); 
//   const [grades, setGrades] = useState({});
//   const [gradedStudents, setGradedStudents] = useState([]); 
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchAnswersAndQuestions = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `http://localhost:8000/answers/descriptive/${examId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${cookies.access_token}`,
//             },
//           }
//         );
//         setData(response.data.data); 
//         setError("");
//       } catch (err) {
//         console.error("خطا در دریافت اطلاعات:", err);
//         setError("مشکلی در دریافت اطلاعات رخ داده است");
//         toast.error("مشکلی در دریافت اطلاعات رخ داده است.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnswersAndQuestions();
//   }, [examId, cookies.access_token]);

//   const handleGradeChange = (userId, questionNumber, value) => {
//     setGrades((prevGrades) => ({
//       ...prevGrades,
//       [userId]: {
//         ...prevGrades[userId],
//         [questionNumber]: value,
//       },
//     }));
//   };

//   const handleSubmitGrades = async (userId, firstname, lastname, phone) => {
//     const userGrades = Object.entries(grades[userId] || {}).map(
//       ([questionNumber, score]) => ({
//         question_number: Number(questionNumber),
//         score: Number(score),
//       })
//     );

//     try {
//       const response = await axios.post(
//         `http://localhost:8000/grade/descriptive/${examId}/${userId}`,
//         userGrades,
//         {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         }
//       );

//       const totalScore = response.data.data.total_score; 

      
//       setData((prevData) => prevData.filter((item) => item.user_id !== userId));

    
//       setGradedStudents((prev) => [
//         ...prev,
//         {
//           id: prev.length + 1, 
//           firstname,
//           lastname,
//           phone,
//           score: totalScore,
//         },
//       ]);

//       toast.success("نمرات با موفقیت ثبت شد.");
//     } catch (err) {
//       console.error("خطا در ثبت نمرات:", err);
//       toast.error("مشکلی در ثبت نمرات رخ داده است.");
//     }
//   };

//   return (
//     <div className="AdminCorrecting_container">
//       <Toaster position="top-right" reverseOrder={false} />

//       <h2>تصحیح پاسخ‌های آزمون {examId}</h2>

//       {loading && <p>در حال بارگذاری...</p>}
//       {error && <p className="error">{error}</p>}

//       {!loading && !error && (
//         <div className="AdminCorrecting_content">
//           {data.length > 0 ? (
//             <ul>
//               {data.map((item) => (
//                 <li key={item.user_id} className="AdminCorrecting_user">
//                   <h3>
//                     دانشجو: {item.firstname} {item.lastname} - شماره تماس:{" "}
//                     {item.phone_number}
//                   </h3>
//                   <div className="AdminCorrecting_questions_answers">
//                     {item.questions.map((q) => (
//                       <div
//                         key={q.question_number}
//                         className="AdminCorrecting_question"
//                       >
//                         <p>
//                           <strong>سؤال {q.question_number}: </strong>
//                           {q.question_text}
//                         </p>
//                         <p>
//                           <strong>نمره کل سؤال: </strong> {q.question_score}
//                         </p>
//                         {item.answers
//                           .filter((a) => a.question_number === q.question_number)
//                           .map((ans) => (
//                             <div
//                               key={ans.question_number}
//                               className="AdminCorrecting_answer"
//                             >
//                               <p>
//                                 <strong>پاسخ: </strong> {ans.answer_text}
//                               </p>
//                               <input
//                                 className="AdminCorrecting_score_input"
//                                 type="number"
//                                 placeholder="نمره دانشجو"
//                                 value={
//                                   grades[item.user_id]?.[q.question_number] || ""
//                                 }
//                                 onChange={(e) =>
//                                   handleGradeChange(
//                                     item.user_id,
//                                     q.question_number,
//                                     e.target.value
//                                   )
//                                 }
//                               />
//                             </div>
//                           ))}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     className="AdminCorrecting_submit_button"
//                     onClick={() =>
//                       handleSubmitGrades(
//                         item.user_id,
//                         item.firstname,
//                         item.lastname,
//                         item.phone_number
//                       )
//                     }
//                   >
//                     ثبت نمرات
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>هیچ پاسخی برای این آزمون یافت نشد</p>
//           )}
//         </div>
//       )}

      
//       {gradedStudents.length > 0 && (
//         <div className="graded-table">
//           <h3>نمرات ثبت‌شده</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>شماره</th>
//                 <th>نام</th>
//                 <th>نام خانوادگی</th>
//                 <th>شماره موبایل</th>
//                 <th>نمره</th>
//               </tr>
//             </thead>
//             <tbody>
//               {gradedStudents.map((student) => (
//                 <tr key={student.id}>
//                   <td>{student.id}</td>
//                   <td>{student.firstname}</td>
//                   <td>{student.lastname}</td>
//                   <td>{student.phone}</td>
//                   <td>{student.score}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminCorrecting;

