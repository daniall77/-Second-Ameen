import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { ScaleLoader, BeatLoader, BounceLoader } from "react-spinners";

function UserExam() {
  const [exams, setExams] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);
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
        toast.error(" خطا در دریافت مسابقات");
        console.error(" خطا در دریافت مسابقات:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserExams();
  }, []);

  const handleShowResult = async (examId, examType) => {
    setLoadingResult(true);
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

      console.log(" نتیجه مسابقه:", response.data);
      setModalData({ examId, examType, result: response.data });
    } catch (error) {
      if (examType === "descriptive" && error.response?.status === 403) {
        toast.error(" این مسابقه هنوز تصحیح نشده است");
      } else {
        setError(" خطا در دریافت نتیجه مسابقه");
        console.error(" خطا:", error);
      }
    } finally {
      setLoadingResult(false);
    }
  };

  const closeModal = () => setModalData(null);

  return (
    <div className="UserExam_container" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="UserExam_container_main">
        <h2 className="UserExam_title">مسابقات شما</h2>

        <section className="UserExam_section">
          {isLoading ? (
            <div className="Loader_Container">
              <ScaleLoader color="#0073e6" height={25} width={3} />
            </div>
          ) : exams.length > 0 ? (
            <div className="UserExam_list">
              {exams.map((exam) => (
                <div key={exam.exam_id} className="UserExam_card">
                  <p className="UserExam_card_id">
                    کد مسابقه: <span className="UserExam_card_id_span">{exam.exam_id}</span>
                  </p>
                  <p className="UserExam_card_title">
                     مسابقه: <span className="UserExam_card_title_span">{exam.exam_title}</span>
                  </p>
                  <p className="UserExam_card_type">
                    نوع مسابقه: 
                    <span className="UserExam_card_type_span">
                      {exam.exam_type === "test" ? "تستی" : "تشریحی"}
                    </span>
                  </p>
                  <button 
                    className="UserExam_result_button"
                    onClick={() => handleShowResult(exam.exam_id, exam.exam_type)}
                    disabled={loadingResult}
                  >
                    {loadingResult ? <BeatLoader color="#fff" /> : "مشاهده نتیجه"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="UserExam_no_exam">شما هنوز در هیچ مسابقه‌ای شرکت نکرده‌اید</p>
          )}
        </section>
      </div>

      {modalData && (
        <div className="UserExam_modal">
          <div className="UserExam_modal_overlay" onClick={closeModal}></div>
          <div className="UserExam_modal_content">
            <h3 className="UserExam_modal_title">نتیجه مسابقه</h3>
            {loadingResult ? (
              <div className="modal_loading">
                <BounceLoader color=" #0073e6" />
              </div>
            ) : error ? (
              <p className="UserExam_modal_error">{error}</p>
            ) : modalData.examType === "test" ? (
              <div className="UserExam_modal_result">
                <p className="UserExam_modal_result_p">
                  تعداد سوالات: <span className="UserExam_modal_result_span">{modalData.result.data.total_questions}</span>
                </p>
                <p className="UserExam_modal_result_p">
                  تعداد پاسخ صحیح: <span className="UserExam_modal_result_span">{modalData.result.data.correct_answers}</span>
                </p>
                <p className="UserExam_modal_result_p">
                  درصد نمره: <span className="UserExam_modal_result_span">{modalData.result.data.score_percentage}%</span>
                </p>
              </div>
            ) : (
              <div className="UserExam_modal_result">
                <p className="UserExam_modal_result_p">
                  نمره نهایی: <span className="UserExam_modal_result_span">{modalData.result.total_score}</span>
                </p>
              </div>
            )}
            <button className="modal_close_button" onClick={closeModal}>
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserExam;
