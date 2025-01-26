import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

function AdminCorrecting() {
  const { examId } = useParams(); 
  const [cookies] = useCookies(["access_token"]);
  const [data, setData] = useState([]); 
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
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
        setError("مشکلی در دریافت اطلاعات رخ داده است.");
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

 
  const handleSubmitGrades = async (userId) => {
    const userGrades = Object.entries(grades[userId] || {}).map(
      ([questionNumber, score]) => ({
        question_number: Number(questionNumber),
        score: Number(score),
      })
    );

    try {
      await axios.post(
        `http://localhost:8000/grade/descriptive/${examId}/${userId}`,
        userGrades,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      alert("نمرات با موفقیت ثبت شد.");
    } catch (err) {
      console.error("خطا در ثبت نمرات:", err);
      alert("مشکلی در ثبت نمرات رخ داده است.");
    }
  };

  return (
    <div className="AdminCorrecting_container">
      <h2>تصحیح پاسخ‌های آزمون {examId}</h2>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="AdminCorrecting_content">
          {data.length > 0 ? (
            <ul>
              {data.map((item) => (
                <li key={item.user_id} className="AdminCorrecting_user">
                  <h3>
                    دانشجو: {item.firstname} {item.lastname} - شماره تماس:{" "}
                    {item.phone_number}
                  </h3>
                  <div className="AdminCorrecting_questions_answers">
                    {item.questions.map((q) => (
                      <div
                        key={q.question_number}
                        className="AdminCorrecting_question"
                      >
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
                            <div
                              key={ans.question_number}
                              className="AdminCorrecting_answer"
                            >
                              <p>
                                <strong>پاسخ: </strong> {ans.answer_text}
                              </p>
                              <input
                                className="AdminCorrecting_score_input"
                                type="number"
                                placeholder="نمره دانشجو"
                                value={
                                  grades[item.user_id]?.[q.question_number] || ""
                                }
                                onChange={(e) =>
                                  handleGradeChange(
                                    item.user_id,
                                    q.question_number,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                  <button
                    className="AdminCorrecting_submit_button"
                    onClick={() => handleSubmitGrades(item.user_id)}
                  >
                    ثبت نمرات
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>هیچ پاسخی برای این آزمون یافت نشد.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminCorrecting;


