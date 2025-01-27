import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";

function AdminViewContent() {
  const [articles, setArticles] = useState([]); 
  const [cookies] = useCookies(["access_token"]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/userArticles", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`, 
          },
        });
        console.log(response.data);
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("خطایی در دریافت اطلاعات مقالات رخ داد.");
        setLoading(false);
      }
    };

    fetchArticles();
  }, [cookies.access_token]);

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="AdminViewContent_container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="AdminViewContent_heading">لیست مقالات</h2>

      {articles.length === 0 ? (
        <p>هیچ مقاله‌ای یافت نشد.</p>
      ) : (
        <div className="AdminViewContent_articles">
          {articles.map((article) => (
            <div key={article.id} className="AdminViewContent_article_card">
              <h3 className="AdminViewContent_article_title">{article.title}</h3>
              <p className="AdminViewContent_article_description">{article.description}</p>
              <p className="AdminViewContent_article_date">
                تاریخ ایجاد: {article.created_at}
              </p>
              {article.updated_at && (
                <p className="AdminViewContent_article_date">
                  آخرین بروزرسانی: {article.updated_at}
                </p>
              )}
              <div className="AdminViewContent_article_categories">
                دسته‌بندی‌ها:{" "}
                {article.category.length > 0
                  ? article.category.join(", ")
                  : "بدون دسته‌بندی"}
              </div>

              
              {article.photo && (
                <div className="AdminViewContent_article_photo">
                  <p>تصویر مقاله:</p>
                  <img
                    src={`http://localhost:8000/articles/${article.photo}`}
                    alt="Article"
                    className="article-image"
                    style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
                  />
                </div>
              )}

              
              {article.text && (
                <div className="AdminViewContent_article_text">
                  <p>متن مقاله:</p>
                  <p>{article.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminViewContent;


