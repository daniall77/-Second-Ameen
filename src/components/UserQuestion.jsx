import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";

function UserQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, timer, description, questions } = location.state || {};
  const [remainingTime, setRemainingTime] = useState(timer * 60);
  const [testAnswers, setTestAnswers] = useState({});
  const [descriptiveAnswers, setDescriptiveAnswers] = useState({});
  const [cookies] = useCookies(["access_token"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const testAnswersRef = useRef(testAnswers);
  const descriptiveAnswersRef = useRef(descriptiveAnswers);

  useEffect(() => {
    testAnswersRef.current = testAnswers;
  }, [testAnswers]);

  useEffect(() => {
    descriptiveAnswersRef.current = descriptiveAnswers;
  }, [descriptiveAnswers]);

  useEffect(() => {
    if (!questions) return;

    console.log("Initial state loaded:", { examId, timer, description, questions });

    const countdown = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          console.log("Timer ended. Calling handleAutoFinishExam.");
          handleAutoFinishExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      console.log("Timer cleared.");
      clearInterval(countdown);
    };
  }, [questions]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTestAnswerChange = (questionNumber, selectedOptionNumber) => {
    setTestAnswers((prevAnswers) => {
      const updatedAnswers = {
        ...prevAnswers,
        [questionNumber]: selectedOptionNumber,
      };
      console.log("Updated test answers:", updatedAnswers);
      return updatedAnswers;
    });
  };

  const handleDescriptiveAnswerChange = (questionNumber, answerText) => {
    setDescriptiveAnswers((prevAnswers) => {
      const updatedAnswers = {
        ...prevAnswers,
        [questionNumber]: answerText,
      };
      console.log("Updated descriptive answers:", updatedAnswers);
      return updatedAnswers;
    });
  };

  const submitAnswers = async () => {
    const currentTestAnswers = { ...testAnswersRef.current };
    const currentDescriptiveAnswers = { ...descriptiveAnswersRef.current };

    console.log("Submitting answers...");
    console.log("Test answers to submit:", currentTestAnswers);
    console.log("Descriptive answers to submit:", currentDescriptiveAnswers);

    try {
      const testAnswersArray = Object.entries(currentTestAnswers).map(
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

      const descriptiveAnswersArray = Object.entries(currentDescriptiveAnswers).map(
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

      return true;
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast.error("خطایی در ارسال پاسخ‌ها رخ داد.");
      return false;
    }
  };

  const handleFinishExam = async () => {
    if (isSubmitting) {
      console.log("Already submitting. Exiting handleFinishExam.");
      return;
    }
    setIsSubmitting(true);
    const success = await submitAnswers();
    if (success) {
      toast.success("پاسخ‌های شما با موفقیت ارسال شد.");
      navigate("/Dashboard/Exam");
    }
  };

  const handleAutoFinishExam = async () => {
    console.log("Auto finish triggered.");
    if (isSubmitting) {
      console.log("Already submitting. Exiting auto finish.");
      return;
    }
    setIsSubmitting(true);

    const success = await submitAnswers();
    if (success) {
      toast.success("زمان آزمون به پایان رسید و پاسخ‌ها ارسال شدند.");
      navigate("/Dashboard/Exam");
    }
  };

  const isTestQuestion = (question) => question.option_1;

  return (
    <div className="UserQuestion_container">
      <Toaster className="Verify_Toaster" position="top-center" reverseOrder={false} />
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





