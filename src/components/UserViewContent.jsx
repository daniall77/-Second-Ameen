import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ScaleLoader } from "react-spinners"; 
import Default from "/image/Default.jpg";

function UserViewContent() {
  const [pendingArticles, setPendingArticles] = useState([]); 
  const [approvedArticles, setApprovedArticles] = useState([]); 
  const [rejectedArticles, setRejectedArticles] = useState([]); 
  const [cookies] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true); 



  const [visiblePending, setVisiblePending] = useState(5);
  const [visibleApproved, setVisibleApproved] = useState(5);
  const [visibleRejected, setVisibleRejected] = useState(5);


  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true); 
      try {
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          axios.get("http://localhost:8000/checklistUserArticles", {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
          axios.get("http://localhost:8000/userApprovedArticles", {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
          axios.get("http://localhost:8000/userRejectedArticles", {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
        ]);

        setPendingArticles(pendingRes.data);
        setApprovedArticles(approvedRes.data);
        setRejectedArticles(rejectedRes.data);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات مقالات:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchArticles();
  }, [cookies.access_token]);




  if (loading) {
    return (
      <div className="Loader_Container">
          <ScaleLoader color=" #0073e6" height={25}   width={3} />
      </div>
    );
  }

  return (
    <div className="UserViewContent_container" dir="rtl">
  
          <div className="UserViewContent_section">
            <h3 className="UserViewContent_container_h">مقالات در حال بررسی</h3>
            {pendingArticles.length === 0 ? (
              <p className="UserViewContent_container_p">هیچ مقاله‌ای در حال بررسی نیست</p>
            ) : (
              <div className="UserViewContent_articles">
                {pendingArticles.slice(0, visiblePending).map((article) => (
                  <div key={article.id} className="UserViewContent_article_card">
                      <div className="UserViewContent_article_card_one">
                          <img
                            src={article.photo ? `http://localhost:8000/articles/${article.photo}` : Default}
                            alt="Article"
                            className="UserViewContent_article_image"
                          />
                          <div className="UserViewContent_article_info">
                              <h4 className="UserViewContent_article_title"> عنوان مقاله : {article.title}</h4>
                              <p className="UserViewContent_article_date">تاریخ ایجاد : {article.created_at}</p>
                              <div className="UserViewContent_article_categories">
                                  دسته‌بندی‌ها: <strong className="" >
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

                      <div className="UserViewContent_article_card_two">
                          <p className="UserViewContent_Article_Text">متن:</p>
                          <div className="UserViewContent_Article_Content" dangerouslySetInnerHTML={{ __html: article.text }}></div>
                      </div>
                  </div>
                ))}
                {pendingArticles.length > visiblePending && (
                      <button className="UserViewContent_show_more" onClick={() => setVisiblePending(visiblePending + 5)}> + بیشتر</button>
                )}
              </div>
            )}
          </div>


          <div className="UserViewContent_section">
            <h3 className="UserViewContent_container_h">مقالات تایید شده</h3>
            {approvedArticles.length === 0 ? (
              <p className="UserViewContent_container_p">هیچ مقاله تایید شده‌ای وجود ندارد</p>
            ) : (
              <div className="UserViewContent_articles">
                {approvedArticles.slice(0, visibleApproved).map((article) => (
                  <div key={article.id} className="UserViewContent_article_card">
                      <div className="UserViewContent_article_card_one">

                          <img
                            src={article.photo ? `http://localhost:8000/articles/${article.photo}` : Default}
                            alt="Article"
                            className="UserViewContent_article_image"
                          />
                          <div className="UserViewContent_article_info">
                              <h4 className="UserViewContent_article_title"> عنوان مقاله : {article.title}</h4>
                              <p className="UserViewContent_article_date"> تاریخ تایید : {article.created_at}</p>
                              <div className="UserViewContent_article_categories">
                                  دسته‌بندی‌ها: <strong className="" >
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
                      <div className="UserViewContent_article_card_two">
                            <p className="UserViewContent_Article_Text">متن:</p>
                            <div className="UserViewContent_Article_Content" dangerouslySetInnerHTML={{ __html: article.text }}></div>
                      </div>
                  </div>
                ))}
                {approvedArticles.length > visibleApproved && (
                     <button className="UserViewContent_show_more" onClick={() => setVisibleApproved(visibleApproved + 5)}> + بیشتر</button>
                )}
              </div>
            )}
          </div>

  
          <div className="UserViewContent_section">
            <h3 className="UserViewContent_container_h">مقالات رد شده</h3>
            {rejectedArticles.length === 0 ? (
              <p className="UserViewContent_container_p">هیچ مقاله رد شده‌ای وجود ندارد</p>
            ) : (
              <div className="UserViewContent_articles">
                {rejectedArticles.slice(0, visibleRejected).map((article) => (
                  <div key={article.id} className="UserViewContent_article_card">

                     <div className="UserViewContent_article_card_one">
                          <img
                            src={article.photo ? `http://localhost:8000/articles/${article.photo}` : Default}
                            alt="Article"
                            className="UserViewContent_article_image"
                          />
                           <div className="UserViewContent_article_info">
                                <h4 className="UserViewContent_article_title"> عنوان مقاله : {article.title}</h4>
                                <p className="UserViewContent_article_date">تاریخ رد : {article.created_at}</p>
                                <div className="UserViewContent_article_categories">
                                      دسته‌بندی‌ها: <strong className="" >
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
                      <div className="UserViewContent_article_card_two">
                            <p className="UserViewContent_Article_Text">متن:</p>
                            <div className="UserViewContent_Article_Content" dangerouslySetInnerHTML={{ __html: article.text }}></div>
                      </div>
                  </div>
                ))}
                {rejectedArticles.length > visibleRejected && (
                    <button className="UserViewContent_show_more" onClick={() => setVisibleRejected(visibleRejected + 5)}>+ بیشتر</button>
                )}
              </div>
            )}
          </div>
  </div>
  );
}

export default UserViewContent;




