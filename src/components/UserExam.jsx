import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

function UserExam() {
  const [cookies] = useCookies(["access_token"]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/exams/list", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        console.log(response.data);
        setExams(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching exams:", err);
        if (err.response?.status === 403) {
          setError("شما مجاز به مشاهده این اطلاعات نیستید.");
        } else {
          setError("خطایی در دریافت اطلاعات رخ داد.");
        }
      }
    };

    fetchExams();
  }, [cookies.access_token]);

  return (
    <div className="UserExam_container">
      <h2>نمایش آزمون‌ها</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : exams.length > 0 ? (
        <div className="exams_list">
          {exams.map((exam) => (
            <div key={exam.ID} className="exam_box">
              <h3>{exam.Title}</h3>
              <p>توضیحات: {exam.Description}</p>
              <p>مدت زمان: {exam.Timer} دقیقه</p>
            </div>
          ))}
        </div>
      ) : (
        <p>هیچ آزمونی برای نمایش وجود ندارد.</p>
      )}
    </div>
  );
}

export default UserExam;
