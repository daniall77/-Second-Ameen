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
      <h2 className="UserExam_h">نمایش آزمون‌ها</h2>
      {error ? (
        <p className="UserExam_p" >{error}</p>
      ) : exams.length > 0 ? (
        <div className="UserExam_div">
          {exams.map((exam) => (
            <div key={exam.ID} className="UserExam_div_text">
              <h3 className="UserExam_div_h" >{exam.Title}</h3>
              <p className="UserExam_div_des" >توضیحات: {exam.Description}</p>
              <p className="UserExam_div_ti" >مدت زمان: {exam.Timer} دقیقه</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="UserExam_nama" >هیچ آزمونی برای نمایش وجود ندارد</p>
      )}
    </div>
  );
}

export default UserExam;
