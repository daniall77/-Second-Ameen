import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { LuCirclePlus } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import { useCookies } from "react-cookie";

function AdminContent() {

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  // section1

  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [cookies] = useCookies(["access_token"]);


  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, ""]);
  };

  const handleRemoveSubcategory = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleChangeSubcategory = (index, value) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index] = value;
    setSubcategories(newSubcategories);
  };

  const handleSubmitTest = async () => {
    
    if (!category.trim()) {
      setError("نام کتگوری نباید خالی باشد.");
      return;
    }

    if (subcategories.some((sub) => !sub.trim())) {
      setError("تمامی فیلدهای ساب‌کتگوری باید پر شوند");
      return;
    }

    setError(""); 

    const dataToSend = {
      name: category,
      subcategories,
    };

    console.log("data :", dataToSend);

    try {
      await axios.post(
        "http://localhost:8000/categories/create",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );

      setIsOpen(false);
      setCategory("");
      setSubcategories([]);
      fetchCategories(); 
    } catch (error) {
      console.error(" خطا در ارسال دسته‌بندی:", error);
    }
  };


  // section1



  // section2


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("خطا در دریافت کتگوری‌ها:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories((prev) => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId],
    }));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    const selectedCategoryIds = Object.keys(selectedCategories)
      .filter((key) => selectedCategories[key])
      .map(Number); 
  
    const selectedSubcategoryIds = Object.keys(selectedSubcategories)
      .filter((key) => selectedSubcategories[key])
      .map(Number);
  
    if (!title || !content || !image || selectedCategoryIds.length === 0) {
      setError("لطفاً تمام فیلدها را پر کنید.");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", content);
    formData.append("file", image);
    formData.append("category_ids", selectedCategoryIds.join(","));
    if (selectedSubcategoryIds.length > 0) {
      formData.append("subcategory_ids", selectedSubcategoryIds.join(","));
    }
  
  
    console.log(" ارسال اطلاعات به بک‌اند:");
    console.log(" عنوان مقاله:", title);
    console.log(" متن مقاله:", content);
    console.log(" فایل تصویر:", image.name);
    console.log(" دسته‌بندی‌های انتخاب‌شده:", selectedCategoryIds);
    console.log(" زیرمجموعه‌های انتخاب‌شده:", selectedSubcategoryIds);
  
    try {
      const response = await axios.post("http://localhost:8000/createArticles", formData, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log(" مقاله با موفقیت ارسال شد:", response.data);
  
      setTitle("");
      setContent("");
      setImage(null);
      setSelectedCategories({});
      setSelectedSubcategories({});
    } catch (error) {
      console.error(" خطا در ارسال مقاله:", error);
      setError("مشکلی در ارسال مقاله پیش آمد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className="form-container">



{/* section1 */}
         
     
                        <button onClick={() => setIsOpen(true)}>افزودن کتگوری</button>

                              {isOpen && (
                                <div className="modal">
                                  <div className="modal-content">
                                    <h2>افزودن کتگوری</h2>

                                  
                                    {error && <p style={{ color: "red" }}>{error}</p>}

                                    <div>
                                      <input
                                        type="text"
                                        placeholder="نام کتگوری"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                      />
                                      <button onClick={handleAddSubcategory}>
                                        <LuCirclePlus />
                                      </button>
                                    </div>

                                  
                                    {subcategories.length > 0 &&
                                      subcategories.map((sub, index) => (
                                        <div key={index}>
                                          <input
                                            type="text"
                                            placeholder="نام ساب‌کتگوری"
                                            value={sub}
                                            onChange={(e) =>
                                              handleChangeSubcategory(index, e.target.value)
                                            }
                                          />
                                          <button onClick={() => handleRemoveSubcategory(index)}>
                                            <FiTrash />
                                          </button>
                                        </div>
                                      ))}

                                    <div>
                                      <button onClick={handleSubmitTest}>ثبت</button>
                                      <button onClick={() => setIsOpen(false)}>بستن</button>
                                    </div>
                                  </div>
                                </div>
                              )}
      


   {/* section1 */}

   

   {/* section2 */}



  

                            <h2 className="form-title">افزودن مقاله جدید</h2>

                            {error && <p className="error-message">{error}</p>}

                            <label className="form-label">عنوان مقاله:</label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="text-input"
                              placeholder="عنوان مقاله را وارد کنید..."
                            />

                            <label className="form-label">انتخاب تصویر مقاله:</label>
                            <input type="file" onChange={handleImageChange} className="file-input" />

                            <label className="form-label">انتخاب کتگوری و ساب‌کتگوری:</label>
                            <div className="dropdown">
                              <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                انتخاب کتگوری
                                <span className={`chevron ${isDropdownOpen ? "rotate" : ""}`}>▼</span>
                              </button>

                              {isDropdownOpen && (
                                <div className="dropdown-menu">
                                  {categories.map((category) => (
                                    <div key={category.id} className="category-item">
                                      <label className="category-label">
                                        <input
                                          type="checkbox"
                                          onChange={() => handleCategoryChange(category.id)}
                                          checked={!!selectedCategories[category.id]}
                                          className="category-checkbox"
                                        />
                                        {category.name}
                                      </label>

                                      {selectedCategories[category.id] && (
                                        <div className="subcategory-list">
                                          {category.subcategories.map((sub) => (
                                            <label key={sub.id} className="subcategory-label">
                                              <input
                                                type="checkbox"
                                                onChange={() => handleSubcategoryChange(sub.id)}
                                                checked={!!selectedSubcategories[sub.id]}
                                                className="subcategory-checkbox"
                                              />
                                              {sub.name}
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <label className="form-label">متن مقاله:</label>
                            <ReactQuill value={content} onChange={setContent} className="text-editor" />

                            <button className="submit-button" onClick={handleSubmit} disabled={loading}>
                              {loading ? "در حال ارسال..." : "ارسال مقاله"}
                            </button>


                  {/* section2 */}
    </div>
  );
}

export default AdminContent;







// بخش دوم

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";

// function AdminContent() {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState({});
//   const [selectedSubcategories, setSelectedSubcategories] = useState({});
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);


//   const [title, setTitle] = useState("");
//   const [image, setImage] = useState(null);
//   const [content, setContent] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/categories");
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error("خطا در دریافت کتگوری‌ها:", error);
//     }
//   };

//   const handleCategoryChange = (categoryId) => {
//     setSelectedCategories((prev) => ({
//       ...prev,
//       [categoryId]: !prev[categoryId],
//     }));
//   };

//   const handleSubcategoryChange = (subcategoryId) => {
//     setSelectedSubcategories((prev) => ({
//       ...prev,
//       [subcategoryId]: !prev[subcategoryId],
//     }));
//   };

//   const handleImageChange = (event) => {
//     setImage(event.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
  
  
//     const selectedCategoryNames = Object.keys(selectedCategories).filter((key) => selectedCategories[key]);
//     const selectedSubcategoryNames = Object.keys(selectedSubcategories).filter((key) => selectedSubcategories[key]);
  
   
//     if (!title || !content || !image || selectedCategoryNames.length === 0) {
//       setError("لطفاً تمام فیلدها را پر کنید.");
//       setLoading(false);
//       return;
//     }
  
  
//     console.log(" دسته‌بندی‌های انتخاب‌شده:", selectedCategoryNames);
//     console.log(" زیرمجموعه‌های انتخاب‌شده:", selectedSubcategoryNames);
//     console.log(" عنوان مقاله:", title);
//     console.log(" متن مقاله:", content);
//     console.log(" فایل تصویر:", image);
  
  
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("text", content);
//     formData.append("file", image);
//     formData.append("categories_list", selectedCategoryNames.join(",")); 
//     if (selectedSubcategoryNames.length > 0) {
//       formData.append("subcategories_list", selectedSubcategoryNames.join(","));
//     }
  
//     try {
//       const response = await axios.post("http://localhost:8000/createArticles", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
  
//       console.log(" مقاله با موفقیت ارسال شد:", response.data);
  
//       setTitle("");
//       setContent("");
//       setImage(null);
//       setSelectedCategories({});
//       setSelectedSubcategories({});
//     } catch (error) {
//       console.error(" خطا در ارسال مقاله:", error);
//       setError("مشکلی در ارسال مقاله پیش آمد. لطفاً دوباره تلاش کنید.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="form-container">
//       <h2 className="form-title">افزودن مقاله جدید</h2>

//       {error && <p className="error-message">{error}</p>}

//       <label className="form-label">عنوان مقاله:</label>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="text-input"
//         placeholder="عنوان مقاله را وارد کنید..."
//       />

//       <label className="form-label">انتخاب تصویر مقاله:</label>
//       <input type="file" onChange={handleImageChange} className="file-input" />

//       <label className="form-label">انتخاب کتگوری و ساب‌کتگوری:</label>
//       <div className="dropdown">
//         <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
//           انتخاب کتگوری
//           <span className={`chevron ${isDropdownOpen ? "rotate" : ""}`}>▼</span>
//         </button>

//         {isDropdownOpen && (
//           <div className="dropdown-menu">
//             {categories.map((category) => (
//               <div key={category.id} className="category-item">
//                 <label className="category-label">
//                   <input
//                     type="checkbox"
//                     onChange={() => handleCategoryChange(category.id)}
//                     checked={!!selectedCategories[category.id]}
//                     className="category-checkbox"
//                   />
//                   {category.name}
//                 </label>

//                 {selectedCategories[category.id] && (
//                   <div className="subcategory-list">
//                     {category.subcategories.map((sub) => (
//                       <label key={sub.id} className="subcategory-label">
//                         <input
//                           type="checkbox"
//                           onChange={() => handleSubcategoryChange(sub.id)}
//                           checked={!!selectedSubcategories[sub.id]}
//                           className="subcategory-checkbox"
//                         />
//                         {sub.name}
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <label className="form-label">متن مقاله:</label>
//       <ReactQuill value={content} onChange={setContent} className="text-editor" />

//       <button className="submit-button" onClick={handleSubmit} disabled={loading}>
//         {loading ? "در حال ارسال..." : "ارسال مقاله"}
//       </button>
//     </div>
//   );
// }

// export default AdminContent;








//   نمایش دراپ داون

// import React, { useState, useEffect } from "react";
// import axios from "axios";


// function AdminContent() {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState({});
//   const [selectedSubcategories, setSelectedSubcategories] = useState({});
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/categories");
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error("خطا در دریافت کتگوری‌ها:", error);
//     }
//   };

//   const handleCategoryChange = (categoryId) => {
//     setSelectedCategories((prev) => ({
//       ...prev,
//       [categoryId]: !prev[categoryId],
//     }));
//   };

//   const handleSubcategoryChange = (subcategoryId) => {
//     setSelectedSubcategories((prev) => ({
//       ...prev,
//       [subcategoryId]: !prev[subcategoryId],
//     }));
//   };

//   return (
//     <div className="dropdown-container">
//       <h2 className="dropdown-title">انتخاب کتگوری و ساب‌کتگوری</h2>

    
//       <div className="dropdown">
//         <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
//           انتخاب کتگوری
//           <span className={`chevron ${isDropdownOpen ? "rotate" : ""}`}>▼</span>
//         </button>


//         {isDropdownOpen && (
//           <div className="dropdown-menu">
//             {categories.map((category) => (
//               <div key={category.id} className="category-item">
             
//                 <label className="category-label">
//                   <input
//                     type="checkbox"
//                     onChange={() => handleCategoryChange(category.id)}
//                     checked={!!selectedCategories[category.id]}
//                     className="category-checkbox"
//                   />
//                   {category.name}
//                 </label>

         
//                 {selectedCategories[category.id] && (
//                   <div className="subcategory-list">
//                     {category.subcategories.map((sub) => (
//                       <label key={sub.id} className="subcategory-label">
//                         <input
//                           type="checkbox"
//                           onChange={() => handleSubcategoryChange(sub.id)}
//                           checked={!!selectedSubcategories[sub.id]}
//                           className="subcategory-checkbox"
//                         />
//                         {sub.name}
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminContent;








//  بخش اول 


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { LuCirclePlus } from "react-icons/lu";
// import { FiTrash } from "react-icons/fi";

// function AdminContent  ()  {
//   const [isOpen, setIsOpen] = useState(false);
//   const [category, setCategory] = useState("");
//   const [subcategories, setSubcategories] = useState([]);
//   const [error, setError] = useState(""); 
//   const [cookies] = useCookies(["access_token"]);
  

//   const handleAddSubcategory = () => {
//     setSubcategories([...subcategories, ""]);
//   };

//   const handleRemoveSubcategory = (index) => {
//     setSubcategories(subcategories.filter((_, i) => i !== index));
//   };

//   const handleChangeSubcategory = (index, value) => {
//     const newSubcategories = [...subcategories];
//     newSubcategories[index] = value;
//     setSubcategories(newSubcategories);
//   };

//   const handleSubmit = async () => {
    
//     if (!category.trim()) {
//       setError("نام کتگوری نباید خالی باشد.");
//       return;
//     }

//     if (subcategories.some((sub) => !sub.trim())) {
//       setError("تمامی فیلدهای ساب‌کتگوری باید پر شوند");
//       return;
//     }

//     setError(""); 

//     const dataToSend = {
//       name: category,
//       subcategories,
//     };

//     console.log("data :", dataToSend);

//     try {
//       await axios.post(
//         "http://localhost:8000/categories/create",
//         dataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         }
//       );

//       setIsOpen(false);
//       setCategory("");
//       setSubcategories([]);
//       fetchCategories(); 
//     } catch (error) {
//       console.error(" خطا در ارسال دسته‌بندی:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={() => setIsOpen(true)}>افزودن کتگوری</button>

//       {isOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>افزودن کتگوری</h2>

          
//             {error && <p style={{ color: "red" }}>{error}</p>}

//             <div>
//               <input
//                 type="text"
//                 placeholder="نام کتگوری"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               />
//               <button onClick={handleAddSubcategory}>
//                 <LuCirclePlus />
//               </button>
//             </div>

           
//             {subcategories.length > 0 &&
//               subcategories.map((sub, index) => (
//                 <div key={index}>
//                   <input
//                     type="text"
//                     placeholder="نام ساب‌کتگوری"
//                     value={sub}
//                     onChange={(e) =>
//                       handleChangeSubcategory(index, e.target.value)
//                     }
//                   />
//                   <button onClick={() => handleRemoveSubcategory(index)}>
//                     <FiTrash />
//                   </button>
//                 </div>
//               ))}

//             <div>
//               <button onClick={handleSubmit}>ثبت</button>
//               <button onClick={() => setIsOpen(false)}>بستن</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminContent;






