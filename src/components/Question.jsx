import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function Question() {
  const location = useLocation();
  const examType = location.state?.examType || "test"; 
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");

  const handleAddQuestion = () => {
    if (examType === "test") {
      if (!currentQuestion || options.some((opt) => opt.trim() === "") || !correctOption) {
        alert("لطفاً تمام فیلدهای سوال تستی را پر کنید");
        return;
      }
      setQuestions([
        ...questions,
        { question: currentQuestion, options: [...options], correct: correctOption, type: "test" },
      ]);
    } else {
      if (!currentQuestion) {
        alert("لطفاً متن سوال تشریحی را وارد کنید");
        return;
      }
      setQuestions([...questions, { question: currentQuestion, type: "descriptive" }]);
    }
    setCurrentQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption("");
  };

  const handleSendQuestions = () => {
    if (questions.length === 0) {
      alert("لطفاً حداقل یک سوال اضافه کنید");
      return;
    }

    console.log("Sending questions to server:", questions);
    alert("سوالات با موفقیت ارسال شدند");
    setQuestions([]);
  };

  return (
    <div className="question_container">
      <h2>ایجاد سوالات</h2>
      <p>نوع آزمون: {examType === "test" ? "تستی" : "تشریحی"}</p>

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

      <button onClick={handleAddQuestion}>اضافه کردن سوال</button>

      <h3>لیست سوالات:</h3>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>
            <strong>سوال {index + 1}: {q.question}</strong>
            {q.type === "test" && (
              <ul>
                {q.options.map((opt, idx) => (
                  <li key={idx} style={{ color: idx === parseInt(q.correct) ? "green" : "black" }}>
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <button onClick={handleSendQuestions}>ارسال سوالات</button>
    </div>
  );
}

export default Question;




// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";

// function Question() {
//   const location = useLocation();
//   const examType = location.state?.examType || "test"; 
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [options, setOptions] = useState(["", "", "", ""]);
//   const [correctOption, setCorrectOption] = useState("");

    
//   const handleAddQuestion = () => {
//     if (examType === "test") {
//       if (!currentQuestion || options.some((opt) => opt.trim() === "") || !correctOption) {
//         alert("لطفاً تمام فیلدهای سوال تستی را پر کنید");
//         return;
//       }
//       setQuestions([
//         ...questions,  
//         { question: currentQuestion, options: [...options], correct: correctOption, type: "test" },
//       ]);
//     } else {
//       if (!currentQuestion) {
//         alert("لطفاً متن سوال تشریحی را وارد کنید");
//         return;
//       }
//       setQuestions([...questions, { question: currentQuestion, type: "descriptive" }]);
//     }
//     setCurrentQuestion("");
//     setOptions(["", "", "", ""]);
//     setCorrectOption("");
//   };

//   const handleSendQuestions = () => {
//     if (questions.length === 0) {
//       alert("لطفاً حداقل یک سوال اضافه کنید");
//       return;
//     }

//     console.log("Sending questions to server:", questions);
//     alert("سوالات با موفقیت ارسال شدند");
//     setQuestions([]);
//   };

//   return (
//     <div className="question_container">
//       <h2>ایجاد سوالات</h2>
//       <p>نوع آزمون: {examType === "test" ? "تستی" : "تشریحی"}</p>

//       <div className="question_form">
//         <label>متن سوال:</label>
//         <textarea
//           value={currentQuestion}
//           onChange={(e) => setCurrentQuestion(e.target.value)}
//           placeholder="متن سوال را وارد کنید"
//         ></textarea>
//       </div>

//       {examType === "test" && (
//         <div className="test_question_form">
//           <label>گزینه‌ها:</label>
//           {options.map((option, index) => (
//             <input
//               key={index}
//               type="text"
//               value={option}
//               onChange={(e) => {
//                 const newOptions = [...options];
//                 newOptions[index] = e.target.value;
//                 setOptions(newOptions);
//               }}
//               placeholder={`گزینه ${index + 1}`}
//             />
//           ))}
//           <label>گزینه صحیح:</label>
//           <select value={correctOption} onChange={(e) => setCorrectOption(e.target.value)}>
//             <option value="">انتخاب کنید</option>
//             {options.map((_, index) => (
//               <option key={index} value={index}>
//                 گزینه {index + 1}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       <button onClick={handleAddQuestion}>اضافه کردن سوال</button>

//       <h3>لیست سوالات:</h3>
//       <ul>
//         {questions.map((q, index) => (
//           <li key={index}>
//             <strong>{q.question}</strong>
//             {q.type === "test" && (
//               <ul>
//                 {q.options.map((opt, idx) => (
//                   <li key={idx} style={{ color: idx === parseInt(q.correct) ? "green" : "black" }}>
//                     {opt}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>

//       <button onClick={handleSendQuestions}>ارسال سوالات</button>
//     </div>
//   );
// }

// export default Question;
