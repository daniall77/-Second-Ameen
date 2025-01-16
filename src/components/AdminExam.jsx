import React, { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminExam() {
  const [cookies] = useCookies(["access_token"]);
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [examType, setExamType] = useState("test");
  const navigate = useNavigate();

  const handleCreateExam = async () => {
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

      alert(`آزمون با موفقیت ایجاد شد: ${examData.title}`);
      setExamTitle("");
      setExamDuration("");
      setExamType("test");

      console.log(response.data);
      const examId = response.data;

      navigate("/Dashboard/Exam/Question", { state: { examType, examId } });
    } catch (error) {
      console.error("Error creating exam:", error.response || error.message);

      if (error.response?.status === 401) {
        alert("خطای احراز هویت. لطفاً دوباره وارد شوید.");
      } else {
        alert("خطایی در ایجاد آزمون رخ داد.");
      }
    }
  };

  return (
    <div className="AdminExam_container">
      <h2 className="AdminExam_h" >ایجاد آزمون جدید</h2>
      <div className="AdminExam_form_group">
        <label className="AdminExam_form_label" >عنوان آزمون:</label>
        <input
          type="text"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          placeholder="عنوان آزمون را وارد کنید"
          className="AdminExam_form_input"
        />
      </div>
      <div className="AdminExam_form_group">
        <label className="AdminExam_form_label" >مدت زمان آزمون (دقیقه):</label>
        <input
          type="number"
          value={examDuration}
          onChange={(e) => setExamDuration(e.target.value)}
          placeholder="مدت زمان آزمون"
          className="AdminExam_form_input"
        />
      </div>
      <div className="AdminExam_form_group">
        <label className="AdminExam_form_label" >نوع آزمون:</label>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="AdminExam_form_select"
        >
          <option  className="AdminExam_form_option" value="test">تستی</option>
          <option  className="AdminExam_form_option" value="descriptive">تشریحی</option>
        </select>
      </div>
      <div className="AdminExam_form_div">
             <button className="AdminExam_form_div_button" onClick={handleCreateExam}>ایجاد آزمون</button>
      </div>

    </div>
  );
}

export default AdminExam;
