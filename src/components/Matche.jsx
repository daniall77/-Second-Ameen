import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Matche() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, examType, questions } = location.state || {};

  const [phoneNumber, setPhoneNumber] = useState("");
  const [answers, setAnswers] = useState({});


  const handleTestAnswerChange = (questionNumber, optionNumber) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: { question_number: questionNumber, selected_option: optionNumber },
    }));
  };

 
  const handleDescriptiveAnswerChange = (questionNumber, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: { question_number: questionNumber, answer_text: value },
    }));
  };

  
  const handleSubmit = async () => {
    if (!phoneNumber) {
      toast.error("لطفاً شماره موبایل خود را وارد کنید.");
      return;
    }

    const formattedAnswers = Object.values(answers);

    const payload = {
      phone_number: phoneNumber,
      exam_id: examId,
      answers: formattedAnswers,
    };
    console.log("data :", payload);

    try {
      if (examType === "test") {
        await axios.post("http://localhost:8000/answers/test", payload);
      } else if (examType === "descriptive") {
        await axios.post("http://localhost:8000/answers/descriptive", payload);
      }

      toast.success("آزمون با موفقیت ارسال شد!");

        navigate("/ListMatches");

    } catch (error) {
      toast.error("خطا در ارسال پاسخ‌ها");
      console.error(" خطا در ارسال پاسخ‌ها:", error);
    }
  };

  return (
    <div className="Matches_container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2>صفحه آزمون</h2>

      {examId ? (
        <div>
          <p>آیدی آزمون: {examId}</p>
          <p>نوع آزمون: {examType}</p>

       
          <div>
            <label>شماره موبایل:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="شماره موبایل خود را وارد کنید..."
            />
          </div>

          <h3>سوالات آزمون:</h3>
          {questions && questions.length > 0 ? (
            <ul>
              {questions.map((question, index) => (
                <li key={index} className="question-card">
                  <p>
                    <strong>سوال {question.question_number}: </strong>
                    {question.question_text}
                  </p>

                 
                  {examType === "test" && (
                    <div className="options">
                      {["option_1", "option_2", "option_3", "option_4"].map((option, i) => (
                        <label key={i} className="option-label">
                          <input
                            type="radio"
                            name={`question_${question.question_number}`}
                            value={i + 1}
                            onChange={() => handleTestAnswerChange(question.question_number, i + 1)}
                          />
                          {` ${i + 1}- ${question[option]}`}
                        </label>
                      ))}
                    </div>
                  )}

              
                  {examType === "descriptive" && (
                    <div>
                      <textarea
                        placeholder="پاسخ خود را وارد کنید..."
                        onChange={(e) => handleDescriptiveAnswerChange(question.question_number, e.target.value)}
                        className="answer-box"
                      />
                      <p><strong>امتیاز:</strong> {question.score}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>سوالی برای این آزمون وجود ندارد</p>
          )}

         
          <button className="submit-button" onClick={handleSubmit}>
            پایان آزمون
          </button>
        </div>
      ) : (
        <p>اطلاعات آزمون یافت نشد!</p>
      )}
    </div>
  );
}

export default Matche;




