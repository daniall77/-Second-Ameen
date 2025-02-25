import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BounceLoader, BeatLoader } from "react-spinners";

function Matche() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, examType, questions } = location.state || {};

  const [phoneNumber, setPhoneNumber] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(!examId || !questions);
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");



  const handleTestAnswerChange = (questionNumber, optionNumber) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: { question_number: questionNumber, selected_option: optionNumber },
    }));
  };

  const handleDescriptiveAnswerChange = (questionNumber, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: { question_number: questionNumber, answer_text: value },
    }));
  };


  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
  
  
    if (!/^\d*$/.test(value)) return;
  
  
    if (value.length > 11) return;
  
    setPhoneNumber(value);
  
   
    if (value.length === 11) {
      if (/^09\d{9}$/.test(value)) {
        setPhoneError("");
      } else {
        setPhoneError("فرمت شماره موبایل نادرست است");
      }
    } else {
      setPhoneError("");
    }
  };

  

  const handleSubmit = async () => {
    if (!phoneNumber) {
      toast.error("لطفاً شماره موبایل خود را وارد کنید");
      return;
    }
  
   
    if (Object.keys(answers).length === 0) {
      toast.error("پاسخ به حداقل یک سوال الزامی است");
      return;
    }
  
    setSubmitting(true);
  
    const formattedAnswers = Object.values(answers);
    const payload = {
      answers: formattedAnswers,
      exam_id: examId,
      phone_number: phoneNumber,
    };
  
    try {
      const url =
        examType === "test"
          ? "http://localhost:8000/answers/test"
          : "http://localhost:8000/answers/descriptive";
  
      await axios.post(url, payload);
  
      toast.success("مسابقه به پایان رسید");
      navigate("/ListMatches");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("شما قبلاً در این آزمون شرکت کرده‌اید");
      } else {
        toast.error("خطا در ارسال پاسخ‌ها");
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="Matches" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="Matches_container">
        {loading ? (
          <div className="Loader_Container">
            <BounceLoader  />
          </div>
        ) : (
          <main className="Matches_main_content">
            <header className="Matches_main_header">
              <h2 className="Matches_main_header_h">سوالات مسابقه</h2>
            </header>

            {examId ? (
              <section className="Matches_exam_section">
                <div className="Matches_exam_info">
                  <p className="Matches_exam_info_p"><strong className="Matches_exam_info_strong">کد مسابقه:</strong> {examId}</p>
                </div>

                <section className="Matches_user_input_section">
                  <label className="Matches_user_label">شماره موبایل:</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="شماره موبایل خود را وارد کنید..."
                    className="Matches_user_input"
                  />
                  {phoneError && <p className="Matches_phone_error">{phoneError}</p>}
                </section>

                <section className="Matches_questions_section">
                  <h3 className="Matches_questions_h">سوالات مسابقه:</h3>

                  {questions && questions.length > 0 ? (
                    <ul className="Matches_questions_list">
                      {questions.map((question, index) => (
                        <li key={index} className="Matches_question_card">
                          <article className="Matches_question_content">
                            <header className="Matches_question_header">
                              <p className="Matches_question_p"><strong className="Matches_question_strong">سوال {question.question_number}:</strong> {question.question_text}</p>
                            </header>

                            {examType === "test" && (
                              <div className="Matches_options_section">
                                {["option_1", "option_2", "option_3", "option_4"].map((option, i) => (
                                  <label
                                    key={i}
                                    className={`Matches_option_label ${answers[question.question_number]?.selected_option === i + 1 ? "selected" : ""}`}
                                    onClick={() => handleTestAnswerChange(question.question_number, i + 1)}
                                  >
                                    {question[option]}
                                    <input
                                      type="radio"
                                      name={`question_${question.question_number}`}
                                      value={i + 1}
                                      className="Matches_option_input"
                                      hidden
                                    />
                                  </label>
                                ))}
                              </div>
                            )}

                              {examType === "descriptive" && (
                                    <div className="Matches_descriptive_section">
                                      <textarea
                                        placeholder="پاسخ خود را وارد کنید..."
                                        onChange={(e) => handleDescriptiveAnswerChange(question.question_number, e.target.value)}
                                        className="Matches_answer_box"
                                      />
                                      <p className="Matches_answer_p">
                                          <strong className="Matches_answer_strong" >امتیاز:</strong> {question.score}
                                      </p>
                                    </div>
                                  )}

                          </article>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="Matches_p">سوالی برای این مسابقه وجود ندارد</p>
                  )}
                </section>

                <footer className="Matches_exam_footer">
                  <button className="Matches_submit_button" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <BeatLoader color="#fff"  /> : "پایان مسابقه"}
                  </button>
                </footer>
              </section>
            ) : (
              <p className="Matches_p">اطلاعات مسابقه یافت نشد</p>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default Matche;

