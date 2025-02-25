import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { BounceLoader , BeatLoader } from "react-spinners";

function AdminCorrecting() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, phoneNumber } = location.state || {};
  const [cookies] = useCookies(["access_token"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/answers/descriptive/${examId}/${phoneNumber}`, {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        });

        setStudentData(response.data.data[0]);

        const initialGrades = {};
        response.data.data[0]?.questions.forEach(q => {
          initialGrades[q.question_number] = "";
        });
        setGrades(initialGrades);
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("هیچ پاسخی برای این مسابقه یافت نشد");
        } else {
          toast.error("خطا در دریافت پاسخ‌های دانش‌آموز");
        }
        console.error("خطا:", error);
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
    setIsSubmitting(true);

    const formattedGrades = Object.entries(grades).map(([question_number, score]) => ({
      question_number: parseInt(question_number),
      score: parseFloat(score),
    }));

    try {
      await axios.post(`http://localhost:8000/grade/descriptive/${examId}/${phoneNumber}`, formattedGrades, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });

      navigate("/Dashboard/ListExam");
      toast.success("نمره ثبت شد");
      
    } catch (error) {
      toast.error("خطا در ارسال نمرات");
      console.error("خطا:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
          <div className="AdminCorrecting_container">
                <Toaster className="AdminCorrecting_Toaster"  position="top-center" reverseOrder={false} />
                
                <header className="AdminCorrecting_header">
                    <h2 className="AdminCorrecting_header_h" >پاسخ‌های دانش‌آموز</h2>
                </header>

                {isLoading ? (
                   <div className="Loader_Container">
                       <BounceLoader color=" #0073e6" height={25}   width={3} />
                  </div>
                ) : studentData ? (
                <section className="AdminCorrecting_student_info_section">
                    <header className="AdminCorrecting_student_header">
                          <p className="AdminCorrecting_student_header_p"><strong className="AdminCorrecting_student_header_strong">شماره تلفن:</strong> {studentData.phone_number}</p>
                    </header>

                    <h3 className="AdminCorrecting_student_h">سوالات و پاسخ‌ها:</h3>

                    <div className="AdminCorrecting_questions_section">
                          {studentData.questions.map((q, index) => (
                          <article key={index} className="AdminCorrecting_question_card">
                              <header className="AdminCorrecting_question_header">
                                <p className="AdminCorrecting_question_p">
                                    <strong className="AdminCorrecting_question_strong">سوال {q.question_number}:</strong> {q.question_text} 
                                    <span className="AdminCorrecting_question_score"> (نمره کل: {q.question_score})</span>
                                </p>
                              </header>

                              <p className="AdminCorrecting_p" >
                                <strong className="AdminCorrecting_strong">پاسخ:</strong> {studentData.answers.find(a => a.question_number === q.question_number)?.answer_text || "بدون پاسخ"}
                              </p>

                              <div className="AdminCorrecting_grade">
                                    <label className="AdminCorrecting_grade_label"><strong className="AdminCorrecting_grade_strong" >نمره:</strong></label>
                                        <input
                                          className="AdminCorrecting_grade_input"
                                          type="number"
                                          min="0"
                                          max={q.question_score}
                                          value={grades[q.question_number]}
                                          onChange={(e) => handleGradeChange(q.question_number, e.target.value)}
                                          placeholder={`${q.question_score}`}
                                        />
                              </div>
                          </article>
                        ))}
                    </div>

                      <footer className="AdminCorrecting_footer">
                        <button className="AdminCorrecting_finish_button" onClick={handleFinishCorrection} disabled={isSubmitting}>
                          {isSubmitting ? <BeatLoader color="#fff"  /> : "پایان تصحیح"}
                        </button>
                      </footer>
                </section>
              ) : (
                  <p className="AdminCorrecting_no_answers_message">هیچ پاسخی برای این مسابقه یافت نشد</p>
              )}
          </div>
  );
}

export default AdminCorrecting;

