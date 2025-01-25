import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

function UserQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, timer, description, questions } = location.state || {};
  const [remainingTime, setRemainingTime] = useState(timer * 60);
  const [testAnswers, setTestAnswers] = useState({});
  const [descriptiveAnswers, setDescriptiveAnswers] = useState({});
  const [cookies, setCookie] = useCookies(["access_token", "completedExams"]);

  useEffect(() => {
    if (!questions) return;

    const countdown = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdown);
          handleFinishExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [questions]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTestAnswerChange = (questionNumber, selectedOptionNumber) => {
    setTestAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionNumber]: selectedOptionNumber,
    }));
  };

  const handleDescriptiveAnswerChange = (questionNumber, answerText) => {
    setDescriptiveAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionNumber]: answerText,
    }));
  };

  const handleFinishExam = async () => {
    try {
      const testAnswersArray = Object.entries(testAnswers).map(
        ([questionNumber, selectedOptionNumber]) => ({
          question_number: parseInt(questionNumber, 10),
          selected_option: selectedOptionNumber,
        })
      );

      if (testAnswersArray.length > 0) {
        await axios.post(
          "http://localhost:8000/answers/test",
          {
            exam_id: examId,
            answers: testAnswersArray,
          },
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          }
        );
      }

      const descriptiveAnswersArray = Object.entries(descriptiveAnswers).map(
        ([questionNumber, answerText]) => ({
          question_number: parseInt(questionNumber, 10),
          answer_text: answerText,
        })
      );

      if (descriptiveAnswersArray.length > 0) {
        await axios.post(
          "http://localhost:8000/answers/descriptive",
          {
            exam_id: examId,
            answers: descriptiveAnswersArray,
          },
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          }
        );
      }

     
      const completedExams = cookies.completedExams || [];
      if (!completedExams.includes(examId)) {
        setCookie("completedExams", [...completedExams, examId], { path: "/" , maxAge: 31536000 });
      }

      alert("پاسخ‌های شما با موفقیت ارسال شد!");
      navigate("/Dashboard/Exam");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("خطایی در ارسال پاسخ‌ها رخ داد.");
    }
  };

  const isTestQuestion = (question) => question.option_1;

  return (
    <div className="UserQuestion_container">
      <h2 className="UserQuestion_heading">آزمون شماره {examId}</h2>
      <p className="UserQuestion_description">توضیحات: {description}</p>
      <p className="UserQuestion_timer">زمان باقی‌مانده: {formatTime(remainingTime)}</p>

      <div className="UserQuestion_questions">
        {questions.map((question, index) => (
          <div
            key={index}
            className={`UserQuestion_question ${
              isTestQuestion(question) ? "UserQuestion_test" : "UserQuestion_descriptive"
            }`}
          >
            <h3>
              سوال {index + 1}: {question.question_text}
            </h3>
            {isTestQuestion(question) ? (
              <ul>
                {[question.option_1, question.option_2, question.option_3, question.option_4].map(
                  (option, idx) => (
                    <li key={idx}>
                      <label>
                        <input
                          type="radio"
                          name={`question_${question.question_number}`}
                          value={idx + 1}
                          onChange={() =>
                            handleTestAnswerChange(question.question_number, idx + 1)
                          }
                        />
                        {idx + 1}. {option}
                      </label>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <textarea
                rows="4"
                cols="50"
                placeholder="پاسخ خود را اینجا بنویسید..."
                onChange={(e) =>
                  handleDescriptiveAnswerChange(question.question_number, e.target.value)
                }
              />
            )}
          </div>
        ))}
      </div>

      <button className="UserQuestion_finish_button" onClick={handleFinishExam}>
        پایان آزمون
      </button>
    </div>
  );
}

export default UserQuestion;












