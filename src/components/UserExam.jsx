import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserExam() {
  const [cookies] = useCookies(["access_token", "completedExams"]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/exams/list", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        setExams(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching exams:", err);
        if (err.response?.status === 403) {
          setError("شما مجاز به مشاهده این اطلاعات نیستید");
        } else {
          setError("خطایی در دریافت اطلاعات رخ داد");
        }
      }
    };

    fetchExams();
  }, [cookies.access_token]);

  const isCompleted = (examId) => {
    return cookies.completedExams?.includes(examId);
  };

  const handleStartExam = async (exam) => {
    if (isCompleted(exam.ID)) {
      alert("این آزمون قبلاً تکمیل شده است");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/exams/${exam.ID}`,
        { exam_id: exam.ID },
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );

      navigate("/Dashboard/Exam/Question", {
        state: {
          examId: exam.ID,
          timer: exam.Timer,
          description: exam.Description,
          questions: response.data,
        },
      });
    } catch (err) {
      console.error("Error starting exam:", err);
      if (err.response?.status === 403) {
        alert("شما مجاز به شروع این آزمون نیستید.");
      } else if (err.response?.status === 404) {
        alert("سوالاتی برای این آزمون یافت نشد.");
      } else {
        alert("خطایی در شروع آزمون رخ داد.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="UserExam_container">
      <h2 className="UserExam_h">نمایش آزمون‌ها</h2>
      {error ? (
        <p className="UserExam_p">{error}</p>
      ) : exams.length > 0 ? (
        <div className="UserExam_div">
          {exams.map((exam) => (
            <div key={exam.ID} className="UserExam_div_text">
              <h3 className="UserExam_div_h">{exam.Title}</h3>
              <p className="UserExam_div_des">توضیحات: {exam.Description}</p>
              <p className="UserExam_div_ti">مدت زمان: {exam.Timer} دقیقه</p>
              <div className="UserExam_buttons">
                <button
                  className="UserExam_start_button"
                  onClick={() => handleStartExam(exam)}
                  disabled={isCompleted(exam.ID) || loading}
                >
                  {loading ? "در حال شروع..." : "شروع آزمون"}
                </button>
                <button
                  className="UserExam_result_button"
                  disabled={!isCompleted(exam.ID)}
                >
                  مشاهده نتیجه
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="UserExam_nama">هیچ آزمونی برای نمایش وجود ندارد</p>
      )}
    </div>
  );
}

export default UserExam;