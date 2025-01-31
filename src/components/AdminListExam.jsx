import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ScaleLoader, BeatLoader } from "react-spinners";

function AdminListExam() {
  const [cookies] = useCookies(["access_token"]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExam, setLoadingExam] = useState(null); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/answers/descriptive/exams", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });

        console.log(response.data);
        setExams(response.data);
        setError("");
      } catch (err) {
        console.error("خطا در دریافت لیست آزمون‌ها:", err);
        setError("مشکلی در دریافت لیست آزمون‌ها رخ داده است");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [cookies.access_token]);

  const handleViewResults = async (examId) => {
    setLoadingExam(examId); 

    try {
      const response = await axios.get(`http://localhost:8000/answers/descriptive/${examId}`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });

      navigate(`/Dashboard/ListExam/Correcting/${examId}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("کاربری برای تصحیح آزمون یافت نشد");
      } else {
        console.error("خطای ناشناخته:", err);
        toast.error("خطایی رخ داده است. لطفاً دوباره تلاش کنید");
      }
    } finally {
      setLoadingExam(null); 
    }
  };

  return (
    <div className="AdminListExam_container">
      <Toaster position="top-center" reverseOrder={false} />

      <h2>آزمون</h2>

     
      {loading ? (
        <div className="loader-container">
          <ScaleLoader  />
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="AdminListExam_exams">
          {exams.length > 0 ? (
            <ul>
              {exams.map((exam) => (
                <li key={exam.id}>
                  <p>عنوان آزمون: {exam.title}</p>
                  <p>توضیحات: {exam.description}</p>
                  <button onClick={() => handleViewResults(exam.id)} disabled={loadingExam === exam.id}>
                    {loadingExam === exam.id ? <BeatLoader /> : "مشاهده نتایج"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>هیچ آزمونی یافت نشد</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminListExam;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";

// function AdminListExam() {
//   const [cookies] = useCookies(["access_token"]);
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("http://localhost:8000/answers/descriptive/exams", {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         });
//         console.log(response.data);
//         setExams(response.data);
//         setError("");
//       } catch (err) {
//         console.error("خطا در دریافت لیست آزمون‌ها:", err);
//         setError("مشکلی در دریافت لیست آزمون‌ها رخ داده است");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExams();
//   }, [cookies.access_token]);

//   const handleViewResults = async (examId) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/answers/descriptive/${examId}`, {
//         headers: {
//           Authorization: `Bearer ${cookies.access_token}`,
//         },
//       });

    
//       navigate(`/Dashboard/ListExam/Correcting/${examId}`);
//     } catch (err) {
//       if (err.response && err.response.status === 404) {
//         toast.error("کاربری برای تصحیح آزمون یافت نشد");
//       } else {
//         console.error("خطای ناشناخته:", err);
//         toast.error("خطایی رخ داده است. لطفاً دوباره تلاش کنید");
//       }
//     }
//   };

//   return (
//     <div className="AdminListExam_container">
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2>آزمون</h2>
//       {loading && <p>در حال بارگذاری...</p>}
//       {error && <p className="error">{error}</p>}

//       {!loading && !error && (
//         <div className="AdminListExam_exams">
//           {exams.length > 0 ? (
//             <ul>
//               {exams.map((exam) => (
//                 <li key={exam.id}>
//                   <p>عنوان آزمون: {exam.title}</p>
//                   <p>توضیحات: {exam.description}</p>
//                   <button onClick={() => handleViewResults(exam.id)}>مشاهده نتایج</button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>هیچ آزمونی یافت نشد</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminListExam;

