import React, { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader } from "react-spinners";

function AdminExam() {
  const [cookies] = useCookies(["access_token"]);
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [examType, setExamType] = useState("test");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const examTypeOptions = [
    { value: "test", label: "تستی" },
    { value: "descriptive", label: "تشریحی" },
  ];

  const handleCreateExam = async () => {
   
    if (!examTitle.trim() || !examDuration.trim() || !examType) {
      toast.error(" پر کردن همه فیلدها الزامی است");
      return;
    }

    setLoading(true); 

    const examData = {
      title: examTitle,
      description: examType,
      timer: parseInt(examDuration),
    };

    console.log("Sending exam data to server:", examData);

    try {
      const response = await axios.post(
        "http://localhost:8000/exams",
        examData,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );

      toast.success(` آزمون "${examData.title}" با موفقیت ایجاد شد`);
      setExamTitle("");
      setExamDuration("");
      setExamType("test");

      console.log(response.data);
      const examId = response.data;

      navigate("/Dashboard/Exam/Question", { state: { examType, examId } });
    } catch (error) {
      console.error("Error creating exam:", error.response || error.message);

      if (error.response?.status === 401) {
        toast.error(" خطای احراز هویت. لطفاً دوباره وارد شوید.");
      } else {
        toast.error(" خطایی در ایجاد آزمون رخ داد.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="EditorExam_container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="EditorExam_h">ایجاد آزمون جدید</h2>

      <div className="EditorExam_form_group">
        <label className="EditorExam_form_label">عنوان آزمون:</label>
        <input
          type="text"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          placeholder="عنوان آزمون را وارد کنید"
          className="EditorExam_form_input"
        />
      </div>

      <div className="EditorExam_form_group">
        <label className="EditorExam_form_label">مدت زمان آزمون (دقیقه):</label>
        <input
          type="number"
          value={examDuration}
          onChange={(e) => setExamDuration(e.target.value)}
          placeholder="مدت زمان آزمون"
          className="EditorExam_form_input"
        />
      </div>

      <div className="EditorExam_form_group">
        <label className="EditorExam_form_label">نوع آزمون:</label>
        <Select
          options={examTypeOptions}
          value={examTypeOptions.find((option) => option.value === examType)}
          onChange={(selectedOption) => setExamType(selectedOption.value)}
          className="EditorExam_form_select"
          placeholder="نوع آزمون را انتخاب کنید"
        />
      </div>

      <div className="EditorExam_form_div">
        <button
          className="EditorExam_form_div_button"
          onClick={handleCreateExam}
          disabled={loading}
        >
          {loading ? <BeatLoader /> : "ایجاد آزمون"}
        </button>
      </div>
    </div>
  );
}

export default AdminExam;




// import React, { useState } from "react";
// import { useCookies } from "react-cookie";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import toast, { Toaster } from "react-hot-toast";

// function AdminExam() {
//   const [cookies] = useCookies(["access_token"]);
//   const [examTitle, setExamTitle] = useState("");
//   const [examDuration, setExamDuration] = useState("");
//   const [examType, setExamType] = useState("test");
//   const navigate = useNavigate();

//   const examTypeOptions = [
//     { value: "test", label: "تستی" },
//     { value: "descriptive", label: "تشریحی" },
//   ];

//   const handleCreateExam = async () => {
//     const examData = {
//       title: examTitle,
//       description: examType,
//       timer: parseInt(examDuration),
//     };

//     console.log("Sending exam data to server:", examData);

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/exams",
//         examData,
//         {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         }
//       );

//       toast.success(`آزمون ${examData.title} با موفقیت ایجاد شد `);
//       setExamTitle("");
//       setExamDuration("");
//       setExamType("test");

//       console.log(response.data);
//       const examId = response.data;

//       navigate("/Dashboard/Exam/Question", { state: { examType, examId } });
//     } catch (error) {
//       console.error("Error creating exam:", error.response || error.message);

//       if (error.response?.status === 401) {
//         toast.error("خطای احراز هویت. لطفاً دوباره وارد شوید.");
//       } else {
//         toast.error("خطایی در ایجاد آزمون رخ داد.");
//       }
//     }
//   };

//   return (
//     <div className="EditorExam_container">
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2 className="EditorExam_h">ایجاد آزمون جدید</h2>
//       <div className="EditorExam_form_group">
//         <label className="EditorExam_form_label">عنوان آزمون:</label>
//         <input
//           type="text"
//           value={examTitle}
//           onChange={(e) => setExamTitle(e.target.value)}
//           placeholder="عنوان آزمون را وارد کنید"
//           className="EditorExam_form_input"
//         />
//       </div>
//       <div className="EditorExam_form_group">
//         <label className="EditorExam_form_label">مدت زمان آزمون (دقیقه):</label>
//         <input
//           type="number"
//           value={examDuration}
//           onChange={(e) => setExamDuration(e.target.value)}
//           placeholder="مدت زمان آزمون"
//           className="EditorExam_form_input"
//         />
//       </div>
//       <div className="EditorExam_form_group">
//         <label className="EditorExam_form_label">نوع آزمون:</label>
//         <Select
//           options={examTypeOptions}
//           value={examTypeOptions.find((option) => option.value === examType)}
//           onChange={(selectedOption) => setExamType(selectedOption.value)}
//           className="EditorExam_form_select"
//           placeholder="نوع آزمون را انتخاب کنید"
//         />
//       </div>
//       <div className="EditorExam_form_div">
//         <button
//           className="EditorExam_form_div_button"
//           onClick={handleCreateExam}
//         >
//           ایجاد آزمون
//         </button>
//       </div>
//     </div>
//   );
// }

// export default AdminExam;








// import React, { useState } from "react";
// import { useCookies } from "react-cookie";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function AdminExam() {
//   const [cookies] = useCookies(["access_token"]);
//   const [examTitle, setExamTitle] = useState("");
//   const [examDuration, setExamDuration] = useState("");
//   const [examType, setExamType] = useState("test");
//   const navigate = useNavigate();

//   const handleCreateExam = async () => {
//     const examData = {
//       title: examTitle,
//       description: examType,
//       timer: parseInt(examDuration),
//     };

//     console.log("Sending exam data to server:", examData);

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/exams",
//         examData,
//         {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         }
//       );

//       alert(`آزمون با موفقیت ایجاد شد: ${examData.title}`);
//       setExamTitle("");
//       setExamDuration("");
//       setExamType("test");

//       console.log(response.data);
//       const examId = response.data;

//       navigate("/Dashboard/Exam/Question", { state: { examType, examId } });
//     } catch (error) {
//       console.error("Error creating exam:", error.response || error.message);

//       if (error.response?.status === 401) {
//         alert("خطای احراز هویت. لطفاً دوباره وارد شوید.");
//       } else {
//         alert("خطایی در ایجاد آزمون رخ داد.");
//       }
//     }
//   };

//   return (
//     <div className="EditorExam_container">
//       <h2 className="EditorExam_h" >ایجاد آزمون جدید</h2>
//       <div className="EditorExam_form_group">
//         <label className="EditorExam_form_label" >عنوان آزمون:</label>
//         <input
//           type="text"
//           value={examTitle}
//           onChange={(e) => setExamTitle(e.target.value)}
//           placeholder="عنوان آزمون را وارد کنید"
//           className="EditorExam_form_input"
//         />
//       </div>
//       <div className="EditorExam_form_group">
//         <label className="EditorExam_form_label" >مدت زمان آزمون (دقیقه):</label>
//         <input
//           type="number"
//           value={examDuration}
//           onChange={(e) => setExamDuration(e.target.value)}
//           placeholder="مدت زمان آزمون"
//           className="EditorExam_form_input"
//         />
//       </div>
//       <div className="EditorExam_form_group">
//         <label className="EditorExam_form_label" >نوع آزمون:</label>
//         <select
//           value={examType}
//           onChange={(e) => setExamType(e.target.value)}
//           className="EditorExam_form_select"
//         >
//           <option  className="EditorExam_form_option" value="test">تستی</option>
//           <option  className="EditorExam_form_option" value="descriptive">تشریحی</option>
//         </select>
//       </div>
//       <div className="EditorExam_form_div">
//              <button className="EditorExam_form_div_button" onClick={handleCreateExam}>ایجاد آزمون</button>
//       </div>

//     </div>
//   );
// }

// export default AdminExam;
