import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";
import { ScaleLoader, BeatLoader } from "react-spinners";
import Default from "/image/Default.jpg";

function AdminConfirmContent() {
  const [articles, setArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState(5); 
  const [cookies] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true);
  const [processingArticle, setProcessingArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/checklistArticles", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        console.log(response.data);
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("خطا در دریافت لیست مقالات");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [cookies.access_token]);

  const handleAction = async (articleId, isApproved) => {
    setProcessingArticle(articleId);

    try {
      const formData = new FormData();
      formData.append("article_id", articleId);
      formData.append("permit", isApproved ? 1 : 0);

      await axios.post("http://localhost:8000/checkArticle", formData, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setArticles((prevArticles) => prevArticles.filter((article) => article.id !== articleId));
      toast.success(isApproved ? "مقاله مورد نظر تایید شد" : "مقاله مورد نظر رد شد");
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("عملیات با خطا مواجه شد.");
    } finally {
      setProcessingArticle(null);
    }
  };


  const showMoreArticles = () => {
    setVisibleArticles((prev) => prev + 5);
  };

  return (
    <div className="AdminConfirmContent_container" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="AdminConfirmContent_container_h">مقالات در انتظار تایید</h2>

      {loading ? (
              <div className="Loader_Container">
                  <ScaleLoader color=" #0073e6" height={25}   width={3} />
             </div>
      ) : articles.length === 0 ? (
        <p className="AdminConfirmContent_container_p">هیچ مقاله‌ای در انتظار تایید نیست</p>
      ) : (
        <div className="AdminConfirmContent_articles">
          {articles.slice(0, visibleArticles).map((article) => (
            <div key={article.id} className="AdminConfirmContent_article_card">
            
              <div className="AdminConfirmContent_article_card_one">
                <img
                  src={article.photo ? `http://localhost:8000/articles/${article.photo}` : Default}
                  alt="Article"
                  className="AdminConfirmContent_article_image"
                />
                <div className="AdminConfirmContent_article_info">
                  <h3 className="AdminConfirmContent_article_title"> عنوان مقاله : {article.title}</h3>
                  <p className="AdminConfirmContent_article_author">نویسنده : {article.author_id}</p>
                  <p className="AdminConfirmContent_article_date">تاریخ ایجاد : {article.created_at}</p>
                  <div className="AdminConfirmContent_article_categories">
                    دسته‌بندی‌ها : {" "}
                    <strong>
                    {article.subcategory && Object.keys(article.subcategory).length > 0 
                                       ? Object.entries(article.subcategory)
                                       .map(([key , values]) =>  values.length > 0 
                                         ? `${key}-${values.join("-")}` : key )
                                         .join(" | ")
                                        : 
                                        "دسته بندی نشده"
                    }
                    </strong>
                  </div>
                </div>
              </div>

              <div className="AdminConfirmContent_article_card_two">
                <p className="AdminConfirmContent_Article_Text">متن:</p>
                <div className="AdminConfirmContent_Article_Content" dangerouslySetInnerHTML={{ __html: article.text }}></div>
              </div>

              
              <div className="AdminConfirmContent_buttons">
                <button
                  className="AdminConfirmContent_approve_button"
                  onClick={() => handleAction(article.id, true)}
                  disabled={processingArticle === article.id}
                >
                  {processingArticle === article.id ? <BeatLoader color="#fff" /> : "تایید"}
                </button>
                <button
                  className="AdminConfirmContent_reject_buttons"
                  onClick={() => handleAction(article.id, false)}
                  disabled={processingArticle === article.id}
                >
                  {processingArticle === article.id ? <BeatLoader color="#fff"  /> : "رد"}
                </button>
              </div>
            </div>
          ))}

         
          {visibleArticles < articles.length && (
            <button className="AdminConfirmContent_show_more" onClick={showMoreArticles}>
                       + بیشتر
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminConfirmContent;





