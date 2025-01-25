import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

function EditorCorrecting() {
  const { examId } = useParams(); 
  const [cookies] = useCookies(["access_token"]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");




  useEffect(() => {
    const fetchAnswers = async () => {
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
        setAnswers(response.data.data); 
        setError("");
      } catch (err) {
        console.error("خطا در دریافت پاسخ‌ها:", err);
        setError("مشکلی در دریافت پاسخ‌ها رخ داده است");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [examId, cookies.access_token]);

  return (
    <div className="Correcting_container">
      <h2>پاسخ‌های آزمون {examId}</h2>
      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="Correcting_answers">
          {answers.length > 0 ? (
            <ul>
              {answers.map((answer) => (
                <li key={answer.user_id}>
                  <p>
                    دانشجو: {answer.firstname} {answer.lastname} - شماره
                    تلفن: {answer.phone_number}
                  </p>
                  <ul>
                    {answer.answers.map((ans, index) => (
                      <li key={index}>
                        <p>سؤال {ans.question_number}: {ans.answer_text}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>پاسخی برای این آزمون یافت نشد</p>
          )}
        </div>
      )}
    </div>
  );
}

export default EditorCorrecting;

