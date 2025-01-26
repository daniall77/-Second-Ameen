import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserExam() {
  const [cookies] = useCookies(["access_token"]);
  const [exams, setExams] = useState([]);
  const [userExamIds, setUserExamIds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [isDescriptive, setIsDescriptive] = useState(false);
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

    const fetchUserExamIds = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/exam/list", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        setUserExamIds(response.data.data); 
      } catch (err) {
        console.error("Error fetching user exams:", err);
        setUserExamIds([]);
      }
    };

    fetchExams();
    fetchUserExamIds();
  }, [cookies.access_token]);

  const handleStartExam = async (exam) => {
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

  const handleViewResult = async (exam) => {
    setLoading(true);
    try {
      if (exam.Description === "descriptive") {
        const response = await axios.get(
          `http://localhost:8000/score/descriptive/${exam.ID}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          }
        );
        setScoreData({ total_score: response.data.total_score });
        setIsDescriptive(true);
      } else {
        const response = await axios.get(
          `http://localhost:8000/score/test/${exam.ID}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          }
        );
        setScoreData(response.data.data);
        setIsDescriptive(false);
      }
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching score:", err);
      alert(
        err.response?.data?.detail ||
          "خطایی در دریافت نمره آزمون رخ داده است."
      );
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
                  disabled={userExamIds.includes(exam.ID) || loading} 
                >
                  {loading ? "در حال شروع..." : "شروع آزمون"}
                </button>
                <button
                  className="UserExam_result_button"
                  onClick={() => handleViewResult(exam)}
                  disabled={!userExamIds.includes(exam.ID)} 
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

      {showModal && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h3>نتیجه آزمون</h3>
            {scoreData ? (
              isDescriptive ? (
                <p>نمره کل: {scoreData.total_score}</p>
              ) : (
                <>
                  <p>تعداد سوالات: {scoreData.total_questions}</p>
                  <p>تعداد پاسخ‌های صحیح: {scoreData.correct_answers}</p>
                  <p>درصد نمره: {scoreData.score_percentage.toFixed(2)}%</p>
                </>
              )
            ) : (
              <p>در حال بارگذاری نمره...</p>
            )}
            <button onClick={() => setShowModal(false)}>بستن</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserExam;






