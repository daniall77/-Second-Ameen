import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader, ScaleLoader } from "react-spinners";

function AdminQuestion() {
  const location = useLocation();
  const examType = location.state?.examType || "test";
  const examId = location.state?.examId;
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(null);
  const [descriptiveScore, setDescriptiveScore] = useState("");
  const [cookies] = useCookies(["access_token"]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const navigate = useNavigate();

  const correctOptionOptions = options.map((_, index) => ({
    value: index,
    label: `گزینه ${index + 1}`,
  }));

  const handleAddQuestion = () => {
    if (loadingAdd) return;
    
    if (examType === "test") {
      if (!currentQuestion || options.some((opt) => opt.trim() === "") || correctOption === null) {
        toast.error("لطفاً تمام فیلدهای سوال تستی را پر کنید");
        return;
      }
    } else {
      if (!currentQuestion || !descriptiveScore || isNaN(descriptiveScore) || descriptiveScore <= 0) {
        toast.error("لطفاً متن سوال و نمره معتبر را وارد کنید");
        return;
      }
    }

    setLoadingAdd(true);
    setLoadingList(true);

    setTimeout(() => {
      const newQuestion =
        examType === "test"
          ? {
              question_number: questions.length + 1,
              question_text: currentQuestion,
              options: [...options],
              correct_option: correctOption.value,
              type: "test",
            }
          : {
              question_number: questions.length + 1,
              question_text: currentQuestion,
              score: descriptiveScore,
              type: "descriptive",
            };

      setQuestions([...questions, newQuestion]);
      setCurrentQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption(null);
      setDescriptiveScore("");
      setLoadingAdd(false);
      setLoadingList(false);
    }, 200);
  };

  const handleSendQuestions = async () => {
    if (loadingSend) return;

    if (questions.length === 0) {
      toast.error("لطفاً حداقل یک سوال اضافه کنید");
      return;
    }

    setLoadingSend(true);

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
            correct_option: question.correct_option + 1,
          };

          await axios.post("http://localhost:8000/questions/test", testQuestionPayload, {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          });
        } else if (question.type === "descriptive") {
          const descriptiveQuestionPayload = {
            exam_id: examId,
            question_number: question.question_number,
            question_text: question.question_text,
            score: parseInt(question.score),
          };

          await axios.post(
            "http://localhost:8000/questions/descriptive",
            descriptiveQuestionPayload,
            {
              headers: {
                Authorization: `Bearer ${cookies.access_token}`,
              },
            }
          );
        }
      }

      toast.success("سوالات با موفقیت ارسال شدند");
      setQuestions([]);
      navigate("/Dashboard/Exam");
    } catch (error) {
      console.error("Error sending questions:", error.response || error.message);
      toast.error("خطا در ارسال سوالات");
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <div className="AdminQuestion_container">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="AdminQuestion_h">ایجاد سوالات</h2>
      <p className="AdminQuestion_examType">نوع آزمون: {examType === "test" ? "تستی" : "تشریحی"}</p>
      <p className="AdminQuestion_examId">شناسه آزمون: {examId}</p>

      <div className="AdminQuestion_div">
        <label className="AdminQuestion_div_label">متن سوال:</label>
        <textarea
          className="AdminQuestion_div_textarea"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="متن سوال را وارد کنید"
        ></textarea>
      </div>

      {examType === "test" && (
        <div className="AdminQuestion_test">
          <label className="AdminQuestion_test_label">گزینه‌ها:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              className="AdminQuestion_test_input"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`گزینه ${index + 1}`}
            />
          ))}
          <label className="AdminQuestion_test_label">گزینه صحیح:</label>
          <Select
            options={correctOptionOptions}
            value={correctOption}
            onChange={(selectedOption) => setCorrectOption(selectedOption)}
            placeholder="انتخاب گزینه صحیح"
          />
        </div>
      )}

      {examType === "descriptive" && (
        <div className="AdminQuestion_descriptive">
          <label className="AdminQuestion_descriptive_label">نمره سوال:</label>
          <input
            type="number"
            value={descriptiveScore}
            onChange={(e) => setDescriptiveScore(e.target.value)}
            placeholder="نمره سوال را وارد کنید"
            className="AdminQuestion_descriptive_input"
          />
        </div>
      )}

      <div className="AdminQuestion_button_div">
        <button className="AdminQuestion_button" onClick={handleAddQuestion} disabled={loadingAdd}>
          {loadingAdd ? <BeatLoader /> : "اضافه کردن سوال"}
        </button>
      </div>

      <h3 className="AdminQuestion_h3">لیست سوالات:</h3>
      {loadingList ? (
        <ScaleLoader />
      ) : (
        <ul className="AdminQuestion_ul">
          {questions.map((q, index) => (
            <li className="AdminQuestion_li" key={index}>
              <strong className="AdminQuestion_strong">
                سوال {q.question_number}: {q.question_text}
              </strong>
              {q.type === "test" && (
                <ul className="AdminQuestion_strong_ul">
                  {q.options.map((opt, idx) => (
                    <li
                      className="AdminQuestion_strong_li"
                      key={idx}
                      style={{ color: idx === q.correct_option ? "green" : "black" }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
              {q.type === "descriptive" && <p className="AdminQuestion_strong_ul_p">نمره: {q.score}</p>}
            </li>
          ))}
        </ul>
      )}

      <div className="AdminQuestion_button_div_one">
        <button className="AdminQuestion_button_one" onClick={handleSendQuestions} disabled={loadingSend}>
          {loadingSend ? <BeatLoader  /> : "ارسال سوالات"}
        </button>
      </div>
    </div>
  );
}

export default AdminQuestion;



// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import Select from "react-select";
// import toast, { Toaster } from "react-hot-toast";

// function AdminQuestion() {
//   const location = useLocation();
//   const examType = location.state?.examType || "test";
//   const examId = location.state?.examId;
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [options, setOptions] = useState(["", "", "", ""]);
//   const [correctOption, setCorrectOption] = useState(null);
//   const [descriptiveScore, setDescriptiveScore] = useState("");
//   const [cookies] = useCookies(["access_token"]);
//   const navigate = useNavigate();

//   const correctOptionOptions = options.map((_, index) => ({
//     value: index,
//     label: `گزینه ${index + 1}`,
//   }));

//   const handleAddQuestion = () => {
//     if (examType === "test") {
//       if (!currentQuestion || options.some((opt) => opt.trim() === "") || correctOption === null) {
//         toast.error("لطفاً تمام فیلدهای سوال تستی را پر کنید");
//         return;
//       }
//       setQuestions([
//         ...questions,
//         {
//           question_number: questions.length + 1,
//           question_text: currentQuestion,
//           options: [...options],
//           correct_option: correctOption.value,
//           type: "test",
//         },
//       ]);
//     } else {
//       if (!currentQuestion || !descriptiveScore || isNaN(descriptiveScore) || descriptiveScore <= 0) {
//         toast.error("لطفاً متن سوال و نمره معتبر را وارد کنید");
//         return;
//       }
//       setQuestions([
//         ...questions,
//         {
//           question_number: questions.length + 1,
//           question_text: currentQuestion,
//           score: descriptiveScore,
//           type: "descriptive",
//         },
//       ]);
//     }
//     setCurrentQuestion("");
//     setOptions(["", "", "", ""]);
//     setCorrectOption(null);
//     setDescriptiveScore("");
//   };

//   const handleSendQuestions = async () => {
//     if (questions.length === 0) {
//       toast.error("لطفاً حداقل یک سوال اضافه کنید");
//       return;
//     }

//     try {
//       for (const question of questions) {
//         if (question.type === "test") {
//           const testQuestionPayload = {
//             exam_id: examId,
//             question_number: question.question_number,
//             question_text: question.question_text,
//             option_1: question.options[0],
//             option_2: question.options[1],
//             option_3: question.options[2],
//             option_4: question.options[3],
//             correct_option: question.correct_option + 1,
//           };

//           await axios.post("http://localhost:8000/questions/test", testQuestionPayload, {
//             headers: {
//               Authorization: `Bearer ${cookies.access_token}`,
//             },
//           });
//         } else if (question.type === "descriptive") {
//           const descriptiveQuestionPayload = {
//             exam_id: examId,
//             question_number: question.question_number,
//             question_text: question.question_text,
//             score: parseInt(question.score),
//           };

//           await axios.post(
//             "http://localhost:8000/questions/descriptive",
//             descriptiveQuestionPayload,
//             {
//               headers: {
//                 Authorization: `Bearer ${cookies.access_token}`,
//               },
//             }
//           );
//         }
//       }

//       toast.success("سوالات با موفقیت ارسال شدند");
//       setQuestions([]);
//       navigate("/Dashboard/Exam");
//     } catch (error) {
//       console.error("Error sending questions:", error.response || error.message);
//       toast.error("خطا در ارسال سوالات");
//     }
//   };

//   return (
//     <div className="AdminQuestion_container">
//       <Toaster position="top-right" reverseOrder={false} />
//       <h2 className="AdminQuestion_h">ایجاد سوالات</h2>
//       <p className="AdminQuestion_examType">نوع آزمون: {examType === "test" ? "تستی" : "تشریحی"}</p>
//       <p className="AdminQuestion_examId">شناسه آزمون: {examId}</p>

//       <div className="AdminQuestion_div">
//         <label className="AdminQuestion_div_label">متن سوال:</label>
//         <textarea
//           className="AdminQuestion_div_textarea"
//           value={currentQuestion}
//           onChange={(e) => setCurrentQuestion(e.target.value)}
//           placeholder="متن سوال را وارد کنید"
//         ></textarea>
//       </div>

//       {examType === "test" && (
//         <div className="AdminQuestion_test">
//           <label className="AdminQuestion_test_label">گزینه‌ها:</label>
//           {options.map((option, index) => (
//             <input
//               key={index}
//               type="text"
//               className="AdminQuestion_test_input"
//               value={option}
//               onChange={(e) => {
//                 const newOptions = [...options];
//                 newOptions[index] = e.target.value;
//                 setOptions(newOptions);
//               }}
//               placeholder={`گزینه ${index + 1}`}
//             />
//           ))}
//           <label className="AdminQuestion_test_label">گزینه صحیح:</label>
//           <Select
//             options={correctOptionOptions}
//             value={correctOption}
//             onChange={(selectedOption) => setCorrectOption(selectedOption)}
//             placeholder="انتخاب گزینه صحیح"
//           />
//         </div>
//       )}

//       {examType === "descriptive" && (
//         <div className="AdminQuestion_descriptive">
//           <label className="AdminQuestion_descriptive_label">نمره سوال:</label>
//           <input
//             type="number"
//             value={descriptiveScore}
//             onChange={(e) => setDescriptiveScore(e.target.value)}
//             placeholder="نمره سوال را وارد کنید"
//             className="AdminQuestion_descriptive_input"
//           />
//         </div>
//       )}

//       <div className="AdminQuestion_button_div">
//         <button className="AdminQuestion_button" onClick={handleAddQuestion}>
//           اضافه کردن سوال
//         </button>
//       </div>

//       <h3 className="AdminQuestion_h3">لیست سوالات:</h3>
//       <ul className="AdminQuestion_ul">
//         {questions.map((q, index) => (
//           <li className="AdminQuestion_li" key={index}>
//             <strong className="AdminQuestion_strong">
//               سوال {q.question_number}: {q.question_text}
//             </strong>
//             {q.type === "test" && (
//               <ul className="AdminQuestion_strong_ul">
//                 {q.options.map((opt, idx) => (
//                   <li
//                     className="AdminQuestion_strong_li"
//                     key={idx}
//                     style={{ color: idx === q.correct_option ? "green" : "black" }}
//                   >
//                     {opt}
//                   </li>
//                 ))}
//               </ul>
//             )}
//             {q.type === "descriptive" && (
//               <p className="AdminQuestion_strong_ul_p">نمره: {q.score}</p>
//             )}
//           </li>
//         ))}
//       </ul>

//       <div className="AdminQuestion_button_div_one">
//         <button className="AdminQuestion_button_one" onClick={handleSendQuestions}>
//           ارسال سوالات
//         </button>
//       </div>
//     </div>
//   );
// }

// export default AdminQuestion;











