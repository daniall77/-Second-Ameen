import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Exam() {
  const [cookies] = useCookies(["role", "access_token"]);
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [examType, setExamType] = useState("test");
  const [exams, setExams] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/exams/list", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        console.log(response.data);
        setExams(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching exams:", err);
        if (err.response?.status === 403) {
          setError("شما مجاز به مشاهده این اطلاعات نیستید.");
        } else {
          setError("خطایی در دریافت اطلاعات رخ داد.");
        }
      }
    };

    if (cookies.role === "user") {
      fetchExams();
    }
  }, [cookies.role, cookies.access_token]);


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
    <div className="Exam_container">
      {cookies.role === "admin" ? (
        <div className="admin_section">
          <h2>ایجاد آزمون جدید</h2>
          <div className="form_group">
            <label>عنوان آزمون:</label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="عنوان آزمون را وارد کنید"
            />
          </div>
          <div className="form_group">
            <label>مدت زمان آزمون (دقیقه):</label>
            <input
              type="number"
              value={examDuration}
              onChange={(e) => setExamDuration(e.target.value)}
              placeholder="مدت زمان آزمون"
            />
          </div>
          <div className="form_group">
            <label>نوع آزمون:</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option value="test">تستی</option>
              <option value="descriptive">تشریحی</option>
            </select>
          </div>
          <button onClick={handleCreateExam}>ایجاد آزمون</button>
        </div>
      ) : (
        <div className="user_editor_section">
          <h2>نمایش آزمون‌ها</h2>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : exams.length > 0 ? (
            <div className="exams_list">
              {exams.map((exam) => (
                <div key={exam.ID} className="exam_box">
                  <h3>{exam.Title}</h3>
                  <p>توضیحات: {exam.Description}</p>
                  <p>مدت زمان: {exam.Timer} دقیقه</p>
                </div>
              ))}
            </div>
          ) : (
            <p>هیچ آزمونی برای نمایش وجود ندارد.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Exam;





