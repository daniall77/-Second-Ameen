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
      for (const question of questions) {
        if (question.type === "test") {
          const testQuestionPayload = {
            exam_id: examId,
            question_number: question.question_number,
            question_text: question.question_text,
            option_1: question.options[0],
            option_2: question.options[1],
            option_3: question.options[2],
            option_4: question.options[3],
            correct_option: parseInt(question.correct_option) + 1,
          };
  
          const response = await axios.post(
            "http://localhost:8000/questions/test",
            testQuestionPayload,
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
              },
            }
          );
          console.log("Test question sent:", response.data);
        } else if (question.type === "descriptive") {
          const descriptiveQuestionPayload = {
            exam_id: examId,
            question_number: question.question_number,
            question_text: question.question_text,
            score: parseInt(question.score),
          };
  
          const response = await axios.post(
            "http://localhost:8000/questions/descriptive",
            descriptiveQuestionPayload,
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
              },
            }
          );
          console.log("Descriptive question sent:", response.data);
        }
      }
  
      alert("سوالات با موفقیت ارسال شدند");
      setQuestions([]);
    } catch (error) {
      console.error("Error sending questions:", error.response || error.message);
      alert("خطا");
    }
  };
  

  return (
    <div className="Question_container">
      <h2 className="Question_h">ایجاد سوالات</h2>
      <p className="Question_examType" >نوع آزمون: {examType === "test" ? "تستی" : "تشریحی"}</p>
      <p className="Question_examId" >شناسه آزمون: {examId}</p>

      <div className="Question_div">
        <label className="Question_div_label" >متن سوال:</label>
        <textarea 
          className="Question_div_textarea"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="متن سوال را وارد کنید"
        ></textarea>
      </div>

      {examType === "test" && (
        <div className="Question_test">
          <label className="Question_test_label">گزینه‌ها:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              className="Question_test_input"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`گزینه ${index + 1}`}
            />
          ))}
          <label className="Question_test_label">گزینه صحیح:</label>
          <select className="Question_test_select" value={correctOption} onChange={(e) => setCorrectOption(e.target.value)}>
            <option className="Question_test_option" value="">انتخاب کنید</option>
            {options.map((_, index) => (
              <option className="Question_test_option" key={index} value={index}>
                گزینه {index + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      {examType === "descriptive" && (
        <div className="Question_descriptive">
          <label className="Question_descriptive_label">نمره سوال:</label>
          <input
            type="number"
            value={descriptiveScore}
            onChange={(e) => setDescriptiveScore(e.target.value)}
            placeholder="نمره سوال را وارد کنید"
            className=""
          />
        </div>
      )}
      
      <div className="Question_button_div">
                <button className="Question_button" onClick={handleAddQuestion}>اضافه کردن سوال</button>
      </div>
     

      <h3 className="Question_h3" >لیست سوالات:</h3>
      <ul className="Question_ul" >
        {questions.map((q, index) => (
          <li className="Question_li" key={index}>
            <strong className="Question_strong" >سوال {q.question_number}: {q.question_text}</strong>
            {q.type === "test" && (
              <ul className="Question_strong_ul">
                {q.options.map((opt, idx) => (
                  <li className="Question_strong_li"  key={idx} style={{ color: idx === parseInt(q.correct_option) ? "green" : "black" }}>
                    {opt}
                  </li>
                ))}
              </ul>
            )}
            {q.type === "descriptive" && (
              <p className="Question_strong_ul_p" >نمره: {q.score}</p>
            )}
          </li>
        ))}
      </ul>
       
      <div className="Question_button_div_one">
                 <button className="Question_button_one" onClick={handleSendQuestions}>ارسال سوالات</button>
      </div>
      
    </div>
  );
}

export default Question;




