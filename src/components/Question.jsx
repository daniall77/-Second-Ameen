import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

function Question() {
  const location = useLocation();
  const examType = location.state?.examType || "test";
  const examId = location.state?.examId; 
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [descriptiveScore, setDescriptiveScore] = useState("");
  const [cookies] = useCookies(["access_token"]);

  const handleAddQuestion = () => {
    if (examType === "test") {
      if (!currentQuestion || options.some((opt) => opt.trim() === "") || !correctOption) {
        alert("لطفاً تمام فیلدهای سوال تستی را پر کنید");
        return;
      }
      setQuestions([
        ...questions,
        { question_number: questions.length + 1, question_text: currentQuestion, options: [...options], correct_option: correctOption, type: "test" },
      ]);
    } else {
      if (!currentQuestion || !descriptiveScore || isNaN(descriptiveScore) || descriptiveScore <= 0) {
        alert("لطفاً متن سوال و نمره معتبر را وارد کنید");
        return;
      }
      setQuestions([
        ...questions,
        { question_number: questions.length + 1, question_text: currentQuestion, score: descriptiveScore, type: "descriptive" },
      ]);
    }
    setCurrentQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption("");
    setDescriptiveScore("");
  };

  const handleSendQuestions = async () => {
    if (questions.length === 0) {
      alert("لطفاً حداقل یک سوال اضافه کنید");
      return;
    }
  
    try {
  
      const testQuestions = questions.filter((q) => q.type === "test").map((q) => ({
        exam_id: examId,
        question_number: q.question_number,
        question_text: q.question_text,
        option_1: q.options[0],
        option_2: q.options[1],
        option_3: q.options[2],
        option_4: q.options[3],
        correct_option: parseInt(q.correct_option) + 1,
      }));
  
      if (testQuestions.length > 0) {
        const response = await axios.post("http://localhost:8000/questions/test", testQuestions, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        console.log("Test questions sent:", response.data);
      }
  
      
      const descriptiveQuestions = questions.filter((q) => q.type === "descriptive").map((q) => ({
        exam_id: examId,
        question_number: q.question_number,
        question_text: q.question_text,
        score: parseInt(q.score),
      }));

      console.log(descriptiveQuestions);
  
      if (descriptiveQuestions.length > 0) {
        const response = await axios.post(
          "http://localhost:8000/questions/descriptive",
          descriptiveQuestions,
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          }
        );
        console.log("Descriptive questions sent:", response.data);
      }
  
      alert("سوالات با موفقیت ارسال شدند");
      setQuestions([]);
    } catch (error) {
      console.error("Error sending questions:", error.response || error.message);
      alert("ارسال سوالات با خطا مواجه شد.");
    }
  };
  

  return (
    <div className="question_container">
      <h2>ایجاد سوالات</h2>
      <p>نوع آزمون: {examType === "test" ? "تستی" : "تشریحی"}</p>
      <p>شناسه آزمون: {examId}</p>

      <div className="question_form">
        <label>متن سوال:</label>
        <textarea
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="متن سوال را وارد کنید"
        ></textarea>
      </div>

      {examType === "test" && (
        <div className="test_question_form">
          <label>گزینه‌ها:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`گزینه ${index + 1}`}
            />
          ))}
          <label>گزینه صحیح:</label>
          <select value={correctOption} onChange={(e) => setCorrectOption(e.target.value)}>
            <option value="">انتخاب کنید</option>
            {options.map((_, index) => (
              <option key={index} value={index}>
                گزینه {index + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      {examType === "descriptive" && (
        <div className="descriptive_question_form">
          <label>نمره سوال:</label>
          <input
            type="number"
            value={descriptiveScore}
            onChange={(e) => setDescriptiveScore(e.target.value)}
            placeholder="نمره سوال را وارد کنید"
          />
        </div>
      )}

      <button onClick={handleAddQuestion}>اضافه کردن سوال</button>

      <h3>لیست سوالات:</h3>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>
            <strong>سوال {q.question_number}: {q.question_text}</strong>
            {q.type === "test" && (
              <ul>
                {q.options.map((opt, idx) => (
                  <li key={idx} style={{ color: idx === parseInt(q.correct_option) ? "green" : "black" }}>
                    {opt}
                  </li>
                ))}
              </ul>
            )}
            {q.type === "descriptive" && (
              <p>نمره: {q.score}</p>
            )}
          </li>
        ))}
      </ul>

      <button onClick={handleSendQuestions}>ارسال سوالات</button>
    </div>
  );
}

export default Question;





