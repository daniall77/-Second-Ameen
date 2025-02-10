import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ScaleLoader, BeatLoader } from "react-spinners";

function ListMatches() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingExamId, setLoadingExamId] = useState(null);
  const navigate = useNavigate();

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

      toast.success(`آزمون ${examId} شروع شد`);
      navigate(`/ListMatches/Matche`, { state: { examId, examType, questions } });
    } catch (error) {
      toast.error("خطا در شروع آزمون");
      console.error("Error starting exam:", error);
    } finally {
      setLoadingExamId(null);
    }
  };

  return (
          <div className="ListMatches_container">
            <Toaster className="ListMatches_Toaster" position="top-center" reverseOrder={false} />

            {loading ? (
              <div className="ListMatches_loader_container">
                <ScaleLoader className="ListMatches_ScaleLoader" />
              </div>
            ) : exams.length > 0 ? (
              <div className="ListMatches_exams_list">
                {exams.map((exam) => (
                  <div key={exam.ID} className="ListMatches_exam_card">
                    <header className="ListMatches_exam_header">
                      <h3 className="ListMatches_exam_title">{exam.Title}</h3>
                    </header>

                    <section className="ListMatches_exam_info">
                      <p className="ListMatches_exam_type">
                        نوع آزمون: <span className="ListMatches_exam_type_span">{exam.Type}</span>
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
                                  <h5 className="ListMatches_article_title">{article.Title}</h5>
                                </header>
                                <footer className="ListMatches_article_footer">
                                  <p className="ListMatches_article_id">
                                    آیدی مقاله: <span className="ListMatches_article_id_span">{article.ID}</span>
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
//     setLoadingExamId(examId); 

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
//     <div className="ListMatches_container">
//       <Toaster position="top-center" reverseOrder={false} />

//       {loading ? (
//         <div className="loader-container">
//           <ScaleLoader  />
//         </div>
//       ) : exams.length > 0 ? (
//         exams.map((exam) => (
//           <div key={exam.ID} className="exam-card">
//             <h3>{exam.Title}</h3>
//             <p>نوع آزمون: {exam.Type}</p>
//             <h4>مقالات مرتبط:</h4>
//             <ul>
//               {exam.Articles.length > 0 ? (
//                 exam.Articles.map((article) => (
//                   <li key={article.ID}>{article.Title} (آیدی: {article.ID})</li>
//                 ))
//               ) : (
//                 <p>بدون مقاله</p>
//               )}
//             </ul>
//             <button
//               className="start-exam-button"
//               onClick={() => handleStartExam(exam.ID, exam.Type)}
//               disabled={loadingExamId === exam.ID}
//             >
//               {loadingExamId === exam.ID ? <BeatLoader  /> : "شروع آزمون"}
//             </button>
//           </div>
//         ))
//       ) : (
//         <p>هیچ آزمونی یافت نشد</p>
//       )}
//     </div>
//   );
// }

// export default ListMatches;



