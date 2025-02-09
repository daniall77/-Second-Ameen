import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { useCookies } from "react-cookie";

function EditorExam() {

  const [examTitle, setExamTitle] = useState("");
  const [examType, setExamType] = useState("test");
  const [selectedArticles, setSelectedArticles] = useState([]); 
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const examTypeOptions = [
    { value: "test", label: "تستی" },
    { value: "descriptive", label: "تشریحی" },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/articles");  
        const formattedArticles = response.data.map((article) => ({
          value: article.id, 
          label: `مقاله ${article.id} - ${article.title} - ${article.text.slice(0, 20)}...`, 
        }));

        setArticles(formattedArticles);
        console.log(response.data);
      } catch (error) {
        console.error("خطا در دریافت مقالات:", error);
        toast.error("خطا در دریافت مقالات");
      }
    };
    fetchArticles();
  }, []);

  const handleCreateExam = async () => {
    if (!examTitle.trim() || !examType || selectedArticles.length === 0) {
      toast.error("پر کردن همه فیلدها الزامی است");
      return;
    }

    setLoading(true);



    const examData = {
      title: examTitle,
      type: examType,
      article_ids: selectedArticles.map((article) => article.value) , 
    };

    console.log(examData);

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
      
      toast.success(`آزمون "${examData.title}" با موفقیت ایجاد شد`);
      setExamTitle("");
      setExamType("test");
      setSelectedArticles([]);

      console.log(response.data);
      const examId = response.data;
      
      navigate("/Dashboard/Exam/Question", { state: { examType, examId } });
    } catch (error) {
      console.error("خطا در ایجاد آزمون:", error.response || error.message);

      if (error.response?.status === 401) {
        toast.error("خطای احراز هویت. لطفاً دوباره وارد شوید");
      } else {
        toast.error("خطایی در ایجاد آزمون رخ داد");
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
        <label className="EditorExam_form_label">مقالات مرتبط:</label>
        <Select
          isMulti
          options={articles} 
          value={selectedArticles} 
          onChange={setSelectedArticles}
          placeholder="عنوان مقاله را انتخاب کنید"
          className="EditorExam_form_select"
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

export default EditorExam;



