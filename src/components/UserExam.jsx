import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";

function UserExam() {
  const [exams, setExams] = useState({});
  const [cookies] = useCookies(["access_token"]);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/exam/list", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });

        console.log(" داده‌های دریافتی:", response.data);
        setExams(response.data.data);
      } catch (error) {
        toast.error(" خطا در دریافت آزمون‌ها");
        console.error(" خطا در دریافت آزمون‌ها:", error);
      }
    };

    fetchUserExams();
  }, []);

  const handleShowResult = async (examId, examType) => {
    setIsLoading(true);
    setError("");

    try {
      const url =
        examType === "test"
          ? `http://localhost:8000/score/test/${examId}`
          : `http://localhost:8000/score/descriptive/${examId}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });

      console.log(" نتیجه آزمون:", response.data);
      setModalData({ examId, examType, result: response.data });
    } catch (error) {
      if (examType === "descriptive" && error.response?.status === 403) {
        toast.error(" این آزمون هنوز تصحیح نشده است");
      } else {
        setError(" خطا در دریافت نتیجه آزمون");
        console.error(" خطا:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setModalData(null);

  return (
    <div className="UserExam_container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2>آزمون‌های شما</h2>

      {Object.keys(exams).length > 0 ? (
        Object.entries(exams).map(([examId, examType]) => (
          <div key={examId} className="exam-card">
            <p>آزمون شماره: {examId}</p>
            <p>نوع آزمون: {examType === "test" ? "تستی" : "تشریحی"}</p>
            <button onClick={() => handleShowResult(examId, examType)}>
              مشاهده نتیجه
            </button>
          </div>
        ))
      ) : (
        <p>شما هنوز در هیچ آزمونی شرکت نکرده‌اید.</p>
      )}

      {modalData && (
        <div className="modal">
          <div className="modal-content">
            <h3>نتیجه آزمون شماره {modalData.examId}</h3>
            {isLoading ? (
              <p>در حال بارگیری...</p>
            ) : error ? (
              <p>{error}</p>
            ) : modalData.examType === "test" ? (
              <div>
                <p>تعداد سوالات: {modalData.result.data.total_questions}</p>
                <p>تعداد پاسخ صحیح: {modalData.result.data.correct_answers}</p>
                <p>درصد نمره: {modalData.result.data.score_percentage}%</p>
              </div>
            ) : (
              <div>
                <p>نمره نهایی: {modalData.result.total_score}</p>
              </div>
            )}
            <button onClick={closeModal}>بستن</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserExam;





