import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { IoClose } from "react-icons/io5";



function AdminEditContent() {
  const [cookies] = useCookies(["access_token"]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [articlePage, setArticlePage] = useState(1);
  const [articleRowsPerPage, setArticleRowsPerPage] = useState(2);


  // modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");

// put

const [initialTitle, setInitialTitle] = useState("");
const [initialImage, setInitialImage] = useState(null);
const [initialContent, setInitialContent] = useState("");





const fetchArticles = async () => {
  try {
    const response = await axios.get("http://localhost:8000/articles");
    setArticles(response.data);
    console.log(response.data);
  } catch (err) {
    console.error("Error fetching articles:", err.message || err);
    setError("Failed to fetch articles.");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {

    fetchArticles();
  }, []);


  const fetchArticleDetails = async (articleId) => {
    try {
      const formData = new FormData();
      formData.append("article_id", articleId); 
  
      const response = await axios.post("http://localhost:8000/article", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(" API :", response.data);
  
      const articleData = response.data;
      setSelectedArticle(articleId);
      setTitle(articleData.title);
      
      setImage({
        fileName: articleData.photo, 
        fileUrl: `http://localhost:8000/articles/${articleData.photo}`,
      });

      setContent(articleData.text);


      // put
      setInitialTitle(articleData.title);
      setInitialContent(articleData.text);
      setInitialImage({
         fileName: articleData.photo,
        fileUrl: `http://localhost:8000/articles/${articleData.photo}`,
      });




      setIsModalOpen(true);
    } catch (err) {
      toast.error("خطا در دریافت اطلاعات مقاله");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage({
         fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileData: file, 
      });
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };
  
  
//  put

const isSaveButtonDisabled = 
title === initialTitle &&
content === initialContent &&
image?.fileName === initialImage?.fileName;



const handleSaveChanges = async () => {
try {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("text", content);
  if (image?.fileData) {
    formData.append("file", image.fileData);
  }

  await axios.put(`http://localhost:8000/editArticle/${selectedArticle}`, formData, {
    headers: {
      Authorization: `Bearer ${cookies.access_token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  toast.success("مقاله با موفقیت به‌روزرسانی شد!");


  setIsModalOpen(false);


  fetchArticles();


} catch (error) {

  if (error.response && error.response.status === 403) {
        toast.error("مجاز به ویرایش این مقاله نیستید");
   } else {
        toast.error("خطا در ویرایش مقاله");
   }
}


};






  const paginate = (data, page, rowsPerPage) => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const renderPageNumbers = (totalItems, currentPage, rowsPerPage, onPageChange) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage + 2 >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${currentPage === i ? "active" : ""} page-button`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const options = [
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
  ];

  const renderPaginationControls = (
    totalItems,
    currentPage,
    rowsPerPage,
    onPageChange,
    onRowsChange
  ) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    return (
      <div className="pagination">
        <div className="pagination_one">
        <button
          className="pagination_button_one"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          اول
        </button>
        <button
          className="pagination_button_two"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          قبلی
        </button>
        {renderPageNumbers(totalItems, currentPage, rowsPerPage, onPageChange)}
        <button
          className="pagination_button_two"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          بعدی
        </button>
        <button
          className="pagination_button_one"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          آخر
        </button>
        </div>
        <div className="pagination_two" >
        <Select
              className="pagination_two_select"
              value={options.find((option) => option.value === rowsPerPage)}
              onChange={(selectedOption) => {
                onRowsChange(selectedOption.value);
                onPageChange(1);
              }}
            options={options}
        />
        </div>
      </div>
    );
  };

  return (
  <div className="AdminViewContent_container">
    <Toaster position="top-center" reverseOrder={false} />
      <div className="AdminViewContent_container_main">
        <h1 className="AdminViewContent_container_main_h">لیست همه مقالات</h1>
        <section className="AdminViewContent_container_main_section">
          {articles.length > 0 ? (
            <>
              <table className="AdminViewContent_container_table">
                <thead className="AdminViewContent_container_thead" >
                  <tr className="AdminViewContent_container_thead_tr" >
                    <th>شماره</th>
                    <th className="AdminViewContent_none" >کد مقاله</th>
                    <th className="AdminViewContent_none" >تاریخ ایجاد</th>
                    <th >تاریخ ویرایش</th>
                    <th className="AdminViewContent_none" >دسته‌بندی</th>
                    <th>عنوان مقاله</th>
                    <th>متن مقاله</th>
                    <th>عکس</th>
                    <th>ویرایش</th>
                  </tr>
                </thead>
                <tbody className="AdminViewContent_container_tbody" >
                  {paginate(articles, articlePage, articleRowsPerPage).map((article, index) => (
                    <tr key={article.id} className="AdminViewContent_container_tbody_tr">
                      <td>{(articlePage - 1) * articleRowsPerPage + index + 1}</td>
                      <td className="AdminViewContent_none" >{article.id}</td>
                      <td className="AdminViewContent_none" >{article.created_at}</td>
                      <td>{article.updated_at ? article.updated_at : "-"}</td>
                      <td className="AdminViewContent_none">{article.category.join("|")}</td>
                      <td>{article.title}</td>
                      <td>{article.text.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 10)}...</td>
                      <td className="AdminViewContent_img">
                        {article.photo ? <img src={`http://localhost:8000/articles/${article.photo}`} alt="مقاله" className="AdminViewContent_container_tbody_img" /> : ""}
                      </td>
                      <td>
                          <button className="AdminViewContent_tbody_button" onClick={() => fetchArticleDetails(article.id)}>
                               ویرایش
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPaginationControls(
                articles.length,
                articlePage,
                articleRowsPerPage,
                setArticlePage,
                setArticleRowsPerPage
              )}
            </>
          ) : (
            <p className="AdminViewContent_container_p">هیچ مقاله‌ای وجود ندارد</p>
          )}
        </section>
      </div>
    

    {isModalOpen && (
      <div className="AdminViewContent_modal">
        <div className="AdminViewContent_modal_content">
             <div className="AdminViewContent_modal_header">
                    <h3 className="AdminViewContent_modal_header_h"> کد مقاله : {selectedArticle} </h3>
                    <button className="AdminViewContent_modal_header_button"  onClick={() => setIsModalOpen(false)}>
                         <IoClose className="AdminContent_IoClose" />
                   </button>
             </div>
             <div className="AdminViewContent_modal_main">
                 <label className="AdminViewContent_label">عنوان مقاله</label>
                 <input type="text" className="AdminViewContent_modal_input" value={title}  onChange={(e) => setTitle(e.target.value)}  />
                  <div className="AdminViewContent_div">
                        <div className="AdminViewContent_file_wrapper">
                             <label for="fileInput" className="AdminViewContent_file_label">تصویر مقاله</label>
                             <input type="file" className="AdminViewContent_file_input" id="fileInput" onChange={handleImageChange} />
                        </div>

                        {image?.fileUrl && <img className="AdminViewContent_image_preview" src={image.fileUrl} alt=""  />}
                  </div>
                  <label className="AdminViewContent_label">متن مقاله</label>
                  <ReactQuill value={content} onChange={handleContentChange} theme="snow" />

             </div>
              
             <div className="AdminContent_modal_div">
                    <button className="AdminContent_modal_div_button" onClick={handleSaveChanges} disabled={isSaveButtonDisabled}>
                         ثبت تغییرات
                    </button>
             </div>

        </div>
      </div>
      )}
      
  </div>
  );
}

export default AdminEditContent;



