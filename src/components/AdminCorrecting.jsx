import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";

function AdminCorrecting() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, phoneNumber } = location.state || {}; 
  const [cookies] = useCookies(["access_token"]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState({}); 

  useEffect(() => {


    const fetchAnswers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/answers/descriptive/${examId}/${phoneNumber}`, {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        });

        console.log(` پاسخ‌های دانش‌آموز ${phoneNumber} برای آزمون ${examId}:`, response.data.data);
        setStudentData(response.data.data[0]); 

        
        const initialGrades = {};
        response.data.data[0]?.questions.forEach(q => {
          initialGrades[q.question_number] = "";
        });
        setGrades(initialGrades);
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error(" هیچ پاسخی برای این آزمون یافت نشد!");
        } else {
          toast.error(" خطا در دریافت پاسخ‌های دانش‌آموز");
        }
        console.error(" خطا:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [examId, phoneNumber]);

  const handleGradeChange = (questionNumber, value) => {
    setGrades(prevGrades => ({
      ...prevGrades,
      [questionNumber]: value,
    }));
  };

  const handleFinishCorrection = async () => {
    const formattedGrades = Object.entries(grades).map(([question_number, score]) => ({
      question_number: parseInt(question_number),
      score: parseFloat(score),
    }));

    try {
      const response = await axios.post(`http://localhost:8000/grade/descriptive/${examId}/${phoneNumber}`, formattedGrades, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });

      toast.success(` تصحیح آزمون با موفقیت انجام شد! نمره کل: ${response.data.data.total_score}`);
      navigate("/Dashboard/ListExam/ListPhone");
    } catch (error) {
      toast.error(" خطا در ارسال نمرات!");
      console.error(" خطا:", error);
    }
  };

  return (
    <div className="AdminCorrecting_container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2>پاسخ‌های دانش‌آموز</h2>

      {isLoading ? (
        <p> در حال بارگیری...</p>
      ) : studentData ? (
        <div className="student-info">
          <h3> {studentData.firstname} {studentData.lastname}</h3>
          <p> شماره تلفن: {studentData.phone_number}</p>
          <h3> سوالات و پاسخ‌ها:</h3>
          {studentData.questions.map((q, index) => (
            <div key={index} className="question-answer">
              <p><strong> سوال {q.question_number}:</strong> {q.question_text} (نمره کل: {q.question_score})</p>
              <p><strong> پاسخ:</strong> {studentData.answers.find(a => a.question_number === q.question_number)?.answer_text || " بدون پاسخ"}</p>
              
              
              <label> نمره:</label>
              <input 
                type="number"
                min="0"
                max={q.question_score}
                value={grades[q.question_number]}
                onChange={(e) => handleGradeChange(q.question_number, e.target.value)}
                placeholder={`حداکثر ${q.question_score}`}
              />
            </div>
          ))}
          <button className="finish-btn" onClick={handleFinishCorrection}> پایان تصحیح</button>
        </div>
      ) : (
        <p> هیچ پاسخی برای این آزمون یافت نشد.</p>
      )}
    </div>
  );
}

export default AdminCorrecting;