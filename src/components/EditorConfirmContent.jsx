import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

function EditorConfirmContent() {
  const [articles, setArticles] = useState([]);
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log("Fetching articles from server...");
        const response = await axios.get("http://localhost:8000/checklistArticles", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        console.log("Fetched articles:", response.data);
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [cookies.access_token]);

  const handleAction = async (articleId, isApproved) => {
    try {
      console.log(`Performing action on article ${articleId}, isApproved: ${isApproved}`);

   
      
      const formData = new FormData();
      formData.append("article_id", articleId);
      formData.append("permit", isApproved ? 1 : 0); 

      const response = await axios.post("http://localhost:8000/checkArticle", formData, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          "Content-Type": "multipart/form-data", 
        },
      });

      console.log("Action response:", response.data);

      
      setArticles(articles.filter((article) => article.id !== articleId));
      alert(isApproved ? "مقاله تایید شد" : "مقاله رد شد");
    } catch (error) {
      console.error("Error performing action:", error);
      alert("عملیات با خطا مواجه شد.");
    }
  };

  return (
    <div className="AdminConfirmContent_container">
      <h2>مقالات در انتظار تایید</h2>

      {articles.length === 0 ? (
        <p>هیچ مقاله‌ای در انتظار تایید نیست</p>
      ) : (
        <div className="AdminConfirmContent_articles">
          {articles.map((article) => (
            <div key={article.id} className="AdminConfirmContent_article_card">
              <h3 className="AdminConfirmContent_article_title">{article.title}</h3>
              <p className="AdminConfirmContent_article_text">{article.text}</p>
              <p className="AdminConfirmContent_article_author">نویسنده: {article.author_id}</p>
              <p className="AdminConfirmContent_article_date">تاریخ ایجاد: {article.created_at}</p>
              <div className="AdminConfirmContent_article_categories">
                دسته‌بندی‌ها: {article.category.join(", ")}
              </div>
              <div className="AdminConfirmContent_buttons">
                <button
                  className="approve-button"
                  onClick={() => handleAction(article.id, true)}
                >
                  تایید
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleAction(article.id, false)}
                >
                  رد
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditorConfirmContent;

