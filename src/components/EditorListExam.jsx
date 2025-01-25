import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


function EditorListExam () {
  const [cookies] = useCookies(["access_token"]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleViewResults = (examId) => {
   
    navigate(`/Dashboard/ListExam/Correcting/${examId}`);
  };

  return (
    <div className="AdminListExam_container">
      <h2> آزمون</h2>
      {loading && <p>در حال بارگذاری...</p>} 
      {error && <p className="error">{error}</p>} 

    
      {!loading && !error && (
        <div className="AdminListExam_exams">
          {exams.length > 0 ? (
            <ul>
              {exams.map((exam) => (
                <li key={exam.id}>
                  <p>عنوان آزمون: {exam.title}</p>
                  <p>توضیحات: {exam.description}</p>
                  <button onClick={() => handleViewResults(exam.id)}>
                    مشاهده نتایج
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

export default EditorListExam ;











