import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function ListMatches() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/exams/list");
        setExams(response.data);
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات آزمون‌ها");
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleStartExam = async (examId, examType) => {
    try {
      const response = await axios.post(`http://localhost:8000/exams/${examId}`);
      const questions = response.data;

      console.log(questions);

      if (!questions || questions.length === 0) {
        toast.error("هیچ سوالی برای این آزمون یافت نشد");
        return;
      }

      toast.success(`آزمون ${examId} شروع شد`);

     
      navigate(`/ListMatches/Matche/${examId}`, { state: { examId, examType, questions } });
    } catch (error) {
      toast.error("خطا در شروع آزمون");
      console.error("Error starting exam:", error);
    }
  };

  return (
    <div className="ListMatches_container">
      <Toaster position="top-center" reverseOrder={false} />

      {loading ? (
        <p>در حال دریافت اطلاعات...</p>
      ) : exams.length > 0 ? (
        exams.map((exam) => (
          <div key={exam.ID} className="exam-card">
            <h3>{exam.Title}</h3>
            <p>نوع آزمون: {exam.Type}</p>
            <h4>مقالات مرتبط:</h4>
            <ul>
              {exam.Articles.length > 0 ? (
                exam.Articles.map((article) => (
                  <li key={article.ID}>{article.Title} (آیدی: {article.ID})</li>
                ))
              ) : (
                <p>بدون مقاله</p>
              )}
            </ul>
            <button
              className="start-exam-button"
              onClick={() => handleStartExam(exam.ID, exam.Type)}
            >
              شروع آزمون
            </button>
          </div>
        ))
      ) : (
        <p>هیچ آزمونی یافت نشد</p>
      )}
    </div>
  );
}

export default ListMatches;











