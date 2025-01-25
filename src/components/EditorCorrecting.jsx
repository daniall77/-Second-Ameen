import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

function EditorCorrecting() {
  const [cookies] = useCookies(["access_token"]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
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

  return (
    <div className="AdminCorrecting_container">
      <h2>آزمون </h2>
      {loading && <p>در حال بارگذاری...</p>} 
      {error && <p className="error">{error}</p>} 

    
      {!loading && !error && (
        <div className="AdminCorrecting_exams">
          {exams.length > 0 ? (
            <ul>
              {exams.map((exam) => (
                <li key={exam.id}>
                  <p>عنوان آزمون: {exam.title}</p>
                  <p>توضیحات: {exam.description}</p>
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

export default EditorCorrecting;










