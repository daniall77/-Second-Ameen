import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

function UserViewContent() {
  const [pendingArticles, setPendingArticles] = useState([]); 
  const [approvedArticles, setApprovedArticles] = useState([]); 
  const [rejectedArticles, setRejectedArticles] = useState([]); 
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    const fetchPendingArticles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/checklistUserArticles", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        setPendingArticles(response.data);
      } catch (error) {
        console.error("Error fetching pending articles:", error);
      }
    };

    const fetchApprovedArticles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/userApprovedArticles", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        setApprovedArticles(response.data);
      } catch (error) {
        console.error("Error fetching approved articles:", error);
      }
    };

    const fetchRejectedArticles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/userRejectedArticles", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        setRejectedArticles(response.data);
      } catch (error) {
        console.error("Error fetching rejected articles:", error);
      }
    };

    fetchPendingArticles();
    fetchApprovedArticles();
    fetchRejectedArticles();
  }, [cookies.access_token]);

  return (
    <div className="UserViewContent_container">
      <h2>لیست مقالات ارسال‌شده</h2>

    
      <div className="UserViewContent_section">
        <h3>مقالات در حال بررسی</h3>
        {pendingArticles.length === 0 ? (
          <p>هیچ مقاله‌ای در حال بررسی نیست.</p>
        ) : (
          <div className="UserViewContent_articles">
            {pendingArticles.map((article) => (
              <div key={article.id} className="UserViewContent_article_card">
                <h4 className="UserViewContent_article_title">{article.title}</h4>
                <img
                  src={`http://localhost:8000/articles/${article.photo}`}
                  alt="Article"
                  className="article-image"
                  style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
                />
                <p className="UserViewContent_article_text">{article.text}</p>
                <p className="UserViewContent_article_date">تاریخ ارسال: {article.created_at}</p>
                <div className="UserViewContent_article_categories">
                  دسته‌بندی‌ها: {article.category.join(", ")}
                </div>
                <p className="UserViewContent_article_status">
                  وضعیت مقاله: <span>در حال بررسی</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="UserViewContent_section">
        <h3>مقالات تایید شده</h3>
        {approvedArticles.length === 0 ? (
          <p>هیچ مقاله تایید شده‌ای وجود ندارد.</p>
        ) : (
          <div className="UserViewContent_articles">
            {approvedArticles.map((article) => (
              <div key={article.id} className="UserViewContent_article_card">
                <h4 className="UserViewContent_article_title">{article.title}</h4>
                <img
                  src={`http://localhost:8000/articles/${article.photo}`}
                  alt="Article"
                  className="article-image"
                  style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
                />
                <p className="UserViewContent_article_text">{article.text}</p>
                <p className="UserViewContent_article_date">تاریخ تایید: {article.created_at}</p>
                <div className="UserViewContent_article_categories">
                  دسته‌بندی‌ها: {article.category.join(", ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="UserViewContent_section">
        <h3>مقالات رد شده</h3>
        {rejectedArticles.length === 0 ? (
          <p>هیچ مقاله رد شده‌ای وجود ندارد.</p>
        ) : (
          <div className="UserViewContent_articles">
            {rejectedArticles.map((article) => (
              <div key={article.id} className="UserViewContent_article_card">
                <h4 className="UserViewContent_article_title">{article.title}</h4>
                <img
                  src={`http://localhost:8000/articles/${article.photo}`}
                  alt="Article"
                  className="article-image"
                  style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
                />
                <p className="UserViewContent_article_text">{article.text}</p>
                <p className="UserViewContent_article_date">تاریخ رد: {article.created_at}</p>
                <div className="UserViewContent_article_categories">
                  دسته‌بندی‌ها: {article.category.join(", ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserViewContent;

