import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ScaleLoader, BeatLoader } from "react-spinners";

function EditorListExam() {
  const [exams, setExams] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingExamId, setLoadingExamId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/answers/descriptive/exams", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });

        console.log("لیست آزمون‌های تشریحی:", response.data);
        setExams(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("هیچ آزمون تشریحی یافت نشد");
        } else {
          toast.error("خطا در دریافت لیست آزمون‌ها");
        }
        console.error("خطا در دریافت آزمون‌ها:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleViewParticipants = (examId) => {
    setLoadingExamId(examId); 

      navigate(`/Dashboard/ListExam/ListPhone`, { state: { examId } });
      setLoadingExamId(null);

  };

  return (
    <div className="AdminListExam_container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2>لیست آزمون‌های تشریحی</h2>

      {isLoading ? (
        <div className="loader-container">
          <ScaleLoader  />
        </div>
      ) : exams.length > 0 ? (
        exams.map((exam) => (
          <div key={exam.id} className="exam-card">
            <p>آزمون شماره: {exam.id}</p>
            <p>عنوان: {exam.title}</p>
            <button onClick={() => handleViewParticipants(exam.id)} disabled={loadingExamId === exam.id}>
              {loadingExamId === exam.id ? <BeatLoader  /> : "مشاهده شرکت‌کنندگان"}
            </button>
          </div>
        ))
      ) : (
        <p>هیچ آزمون تشریحی یافت نشد</p>
      )}
    </div>
  );
}

export default EditorListExam;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";

// function EditorListExam() {
//   const [exams, setExams] = useState([]); 
//   const [cookies] = useCookies(["access_token"]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExams = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get("http://localhost:8000/answers/descriptive/exams", {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         });

//         console.log(" لیست آزمون‌های تشریحی:", response.data);
//         setExams(response.data);
//       } catch (error) {
//         if (error.response?.status === 404) {
//           toast.error(" هیچ آزمون تشریحی یافت نشد!");
//         } else {
//           toast.error(" خطا در دریافت لیست آزمون‌ها");
//         }
//         console.error(" خطا در دریافت آزمون‌ها:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchExams();
//   }, []);

//   const handleViewParticipants = (examId) => {
//     navigate(`/Dashboard/ListExam/ListPhone`, { state: { examId } }); 
//   };

//   return (
//     <div className="AdminListExam_container">
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2>لیست آزمون‌های تشریحی</h2>

//       {isLoading ? (
//         <p> در حال بارگیری...</p>
//       ) : exams.length > 0 ? (
//         exams.map((exam) => (
//           <div key={exam.id} className="exam-card">
//             <p> آزمون شماره: {exam.id}</p>
//             <p> عنوان: {exam.title}</p>
//             <button onClick={() => handleViewParticipants(exam.id)}> مشاهده شرکت‌کنندگان</button>
//           </div>
//         ))
//       ) : (
//         <p> هیچ آزمون تشریحی یافت نشد</p>
//       )}
//     </div>
//   );
// }

// export default EditorListExam;

