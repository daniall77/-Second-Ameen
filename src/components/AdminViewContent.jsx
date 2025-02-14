import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

function AdminViewContent() {
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






  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/userArticles", {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        });
        setArticles(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching articles:", err.message || err);
        setError("Failed to fetch articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [cookies.access_token]);


  const fetchArticleDetails = async (articleId) => {
    try {
      const formData = new FormData();
      formData.append("article_id", articleId); 
  
      const response = await axios.post("http://localhost:8000/article", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(" API rajae :", response.data);
  
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

  setArticles((prevArticles) =>
    prevArticles.map((article) =>
      article.id === selectedArticle
        ? { ...article, title, text: content, photo: image?.fileName }
        : article
    )
  );


  setIsModalOpen(false);




} catch (error) {
  toast.error("خطا در ویرایش مقاله");
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
    <div className="AdminDashboard">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="AdminDashboard_container">
        <div className="AdminDashboard_container_main">
          <h1 className="AdminDashboard_container_main_h">لیست مقالات من</h1>
          <section className="AdminDashboard_container_main_section">
            <h2 className="AdminDashboard_container_main_section_h">مقالات من</h2>
            {articles.length > 0 ? (
              <>
                <table className="AdminDashboard_container_table">
                  <thead>
                    <tr>
                      <th>شماره</th>
                      <th>کد مقاله</th>
                      <th>تاریخ ایجاد</th>
                      <th>تاریخ ویرایش</th>
                      <th>دسته‌بندی</th>
                      <th>عنوان مقاله</th>
                      <th>متن مقاله</th>
                      <th>عکس</th>
                      <th>ویرایش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginate(articles, articlePage, articleRowsPerPage).map((article, index) => (
                      <tr key={article.id}>
                        <td>{(articlePage - 1) * articleRowsPerPage + index + 1}</td>
                        <td>{article.id}</td>
                        <td>{article.created_at}</td>
                        <td>{article.updated_at ? article.updated_at : "-"}</td>
                        <td>{article.category.join(" , ")}</td>
                        <td>{article.title}</td>
                        <td>{article.text.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 50)}...</td>
                        <td>
                          {article.photo ? <img src={`http://localhost:8000/articles/${article.photo}`} alt="مقاله" width="50" height="50" /> : "-"}
                        </td>
                        <td>
                            <button className="AdminDashboard_button" onClick={() => fetchArticleDetails(article.id)}>
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
              <p className="AdminDashboard_container_p">هیچ مقاله‌ای وجود ندارد</p>
            )}
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal_content">
            <h2>اطلاعات مقاله</h2>
            <h3> کد مقاله  {selectedArticle} </h3>
            <label>عنوان مقاله</label>
            <input type="text" value={title}  onChange={(e) => setTitle(e.target.value)}  />

            <label>تصویر مقاله</label>
                    <label className="form-label">انتخاب تصویر مقاله:</label>
                    <input type="file" className="file-input" onChange={handleImageChange} />

                   {image?.fileName && <p>فایل انتخاب شده: {image.fileName}</p>}

                  {image?.fileUrl && <img src={image.fileUrl} alt="مقاله" width="100" height="100" />}


                  <label>متن مقاله</label>
                  <ReactQuill value={content} onChange={handleContentChange} theme="snow" />

                <button onClick={() => setIsModalOpen(false)}>بستن</button>
                
               

                <button onClick={handleSaveChanges} disabled={isSaveButtonDisabled}>
                     ثبت تغییرات
               </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminViewContent;











//   برای  pagination


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import toast, { Toaster } from "react-hot-toast";
// import Select from "react-select";

// function AdminViewContent() {
//   const [cookies] = useCookies(["access_token"]);
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [articlePage, setArticlePage] = useState(1);
//   const [articleRowsPerPage, setArticleRowsPerPage] = useState(2);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/userArticles", {
//           headers: { Authorization: `Bearer ${cookies.access_token}` },
//         });
//         setArticles(response.data);
//         console.log(response.data);
//       } catch (err) {
//         console.error("Error fetching articles:", err.message || err);
//         setError("Failed to fetch articles.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, [cookies.access_token]);

//   const paginate = (data, page, rowsPerPage) => {
//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   };

//   const renderPageNumbers = (totalItems, currentPage, rowsPerPage, onPageChange) => {
//     const totalPages = Math.ceil(totalItems / rowsPerPage);
//     const maxVisiblePages = 5;
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, currentPage + 2);

//     if (currentPage <= 3) {
//       endPage = Math.min(maxVisiblePages, totalPages);
//     } else if (currentPage + 2 >= totalPages) {
//       startPage = Math.max(1, totalPages - maxVisiblePages + 1);
//     }

//     const pageNumbers = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <button
//           key={i}
//           onClick={() => onPageChange(i)}
//           className={`${currentPage === i ? "active" : ""} page-button`}
//         >
//           {i}
//         </button>
//       );
//     }
//     return pageNumbers;
//   };

//   const options = [
//     { value: 2, label: "2" },
//     { value: 5, label: "5" },
//     { value: 10, label: "10" },
//     { value: 15, label: "15" },
//     { value: 20, label: "20" },
//   ];

//   const renderPaginationControls = (
//     totalItems,
//     currentPage,
//     rowsPerPage,
//     onPageChange,
//     onRowsChange
//   ) => {
//     const totalPages = Math.ceil(totalItems / rowsPerPage);

//     return (
//       <div className="pagination">
//         <div className="pagination_one">
//         <button
//           className="pagination_button_one"
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//         >
//           اول
//         </button>
//         <button
//           className="pagination_button_two"
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           قبلی
//         </button>
//         {renderPageNumbers(totalItems, currentPage, rowsPerPage, onPageChange)}
//         <button
//           className="pagination_button_two"
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           بعدی
//         </button>
//         <button
//           className="pagination_button_one"
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//         >
//           آخر
//         </button>
//         </div>
//         <div className="pagination_two" >
//         <Select
//               className="pagination_two_select"
//               value={options.find((option) => option.value === rowsPerPage)}
//               onChange={(selectedOption) => {
//                 onRowsChange(selectedOption.value);
//                 onPageChange(1);
//               }}
//             options={options}
//         />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="AdminDashboard">
//       <Toaster position="top-center" reverseOrder={false} />
//       <div className="AdminDashboard_container">
//         <div className="AdminDashboard_container_main">
//           <h1 className="AdminDashboard_container_main_h">لیست مقالات من</h1>
//           <section className="AdminDashboard_container_main_section">
//             <h2 className="AdminDashboard_container_main_section_h">مقالات من</h2>
//             {articles.length > 0 ? (
//               <>
//                 <table className="AdminDashboard_container_table">
//                   <thead>
//                     <tr>
//                       <th>شماره</th>
//                       <th>کد مقاله</th>
//                       <th>تاریخ ایجاد</th>
//                       <th>تاریخ ویرایش</th>
//                       <th>دسته‌بندی</th>
//                       <th>عنوان مقاله</th>
//                       <th>متن مقاله</th>
//                       <th>عکس</th>
//                       <th>ویرایش</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginate(articles, articlePage, articleRowsPerPage).map((article, index) => (
//                       <tr key={article.id}>
//                         <td>{(articlePage - 1) * articleRowsPerPage + index + 1}</td>
//                         <td>{article.id}</td>
//                         <td>{article.created_at}</td>
//                         <td>{article.updated_at ? article.updated_at : "-"}</td>
//                         <td>{article.category.join(" , ")}</td>
//                         <td>{article.title}</td>
//                         <td>{article.text.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 50)}...</td>
//                         <td>
//                           {article.image_url ? <img src={article.image_url} alt="مقاله" width="50" height="50" /> : "-"}
//                         </td>
//                         <td>
//                           <button className="AdminDashboard_button">ویرایش</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {renderPaginationControls(
//                   articles.length,
//                   articlePage,
//                   articleRowsPerPage,
//                   setArticlePage,
//                   setArticleRowsPerPage
//                 )}
//               </>
//             ) : (
//               <p className="AdminDashboard_container_p">هیچ مقاله‌ای وجود ندارد</p>
//             )}
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminViewContent;
