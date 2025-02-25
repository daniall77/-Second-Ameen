import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useCookies } from "react-cookie";
import { ScaleLoader, BeatLoader, ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";




function UserContent() {

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["access_token"]);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);



  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("خطا در دریافت کتگوری‌ها:", error);
    } finally {
      setPageLoading(false);
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

  // const handleImageChange = (event) => {
  //   setImage(event.target.files[0]);
  // };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImageLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    const persianRegex = /^[\u0600-\u06FF\s]+$/;
    if (value === "" || persianRegex.test(value)) {
      setTitle(value);
      setError(null);
    } else {
      setError("کیبورد خود را فارسی کنید");
    }
  };


  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error("پر کردن فیلد عنوان و متن مقاله الزامی است");
      return;
    }

    setLoading(true);
    setError(null);
  
    const selectedCategoryIds = Object.keys(selectedCategories)
      .filter((key) => selectedCategories[key])
      .map(Number); 
  
    const selectedSubcategoryIds = Object.keys(selectedSubcategories)
      .filter((key) => selectedSubcategories[key])
      .map(Number);
  

  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("text", content);
      if (image) {
        formData.append("file", image);
      }
      if (selectedCategoryIds.length > 0) {
        formData.append("category_ids", selectedCategoryIds.join(","));
      }
      if (selectedSubcategoryIds.length > 0) {
        formData.append("subcategory_ids", selectedSubcategoryIds.join(","));
      }

      // formData.append("category_ids", selectedCategoryIds.length > 0 ? selectedCategoryIds.join(",") : null);
      // formData.append("subcategory_ids", selectedSubcategoryIds.length > 0 ? selectedSubcategoryIds.join(",") : null);
      

      console.log(" ارسال اطلاعات به بک‌اند:");
      console.log(" عنوان مقاله:", title);
      console.log(" متن مقاله:", content);
      console.log(" فایل تصویر:", image ? image.name : "بدون تصویر");
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
  
      toast.success("مقاله با موفقیت ارسال شد");
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setSelectedCategories({});
      setSelectedSubcategories({});
    } catch (error) {
      console.error("خطا در ارسال مقاله:", error);
      setError("مشکلی در ارسال مقاله پیش آمد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="AdminContent_container" dir="rtl">

<Toaster position="top-center" reverseOrder={false} />
      {pageLoading ? (
           <div className="Loader_Container">
               <ScaleLoader color=" #0073e6" height={25}   width={3} />
          </div>
      ) : (
       
            <div className="AdminContent_box">
                <div className="AdminContent_container_two">

                    <h2 className="AdminContent_container_header" >افزودن مقاله جدید</h2>


                    <label className="AdminContent_label">عنوان مقاله:</label>
                    <input type="text" value={title} onChange={handleTitleChange} className="AdminContent_text_input" placeholder="عنوان مقاله را وارد کنید..." />
                    {error && <p className="AdminContent_message">{error}</p>}

                    <label className="AdminContent_label">انتخاب تصویر مقاله:</label>
                    <div className="AdminContent_file_one">
                            <div className="AdminContent_file_wrapper">
                                  <input type="file" id="fileInput" onChange={handleImageChange} className="AdminContent_file_input" />
                                  <label for="fileInput" className="AdminContent_file_label">انتخاب فایل</label>
                            </div>
                            {imageLoading ? <ClipLoader className="AdminContent_ClipLoader" /> : imagePreview && <img src={imagePreview} alt="Preview" className="AdminContent_image_preview" />}
                    </div>
                    <label className="AdminContent_label"> دسته بندی:</label>
                    <div className="AdminContent_dropdown">
                    <button className="AdminContent_dropdown_button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <p> انتخاب  دسته بندی </p>  
                        
                            <span className="AdminContent_chevron" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                  {isDropdownOpen ? (
                                        <IoChevronUpOutline className="AdminContent_IoChevronUpOutline" />
                                      ) : (
                                        <IoChevronDownOutline className="AdminContent_IoChevronDownOutline" />
                                      )}
                              </span>
                    </button>

                    {isDropdownOpen && (
                      <div className="AdminContent_dropdown_menu">
                        {categories.map((category) => (
                          <div key={category.id} className="AdminContent_category_item">
                            <label className="AdminContent_category_label">
                              <input
                                type="checkbox"
                                onChange={() => handleCategoryChange(category.id)}
                                checked={!!selectedCategories[category.id]}
                                className="AdminContent_category_checkbox"
                              />
                              {category.name}
                            </label>

                            {selectedCategories[category.id] && (
                              <div className="AdminContent_subcategory_list">
                                {category.subcategories.map((sub) => (
                                  <label key={sub.id} className="AdminContent_subcategory_label">
                                    <input
                                      type="checkbox"
                                      onChange={() => handleSubcategoryChange(sub.id)}
                                      checked={!!selectedSubcategories[sub.id]}
                                      className="AdminContent_subcategory_checkbox"
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

                    <label className="AdminContent_label">متن مقاله:</label>
                    <ReactQuill value={content} onChange={setContent} className="AdminContent_text_editor" />
                    
                    <div className="AdminContent_submit">
                          <button className="AdminContent_submit_button" onClick={handleSubmit} disabled={loading}>
                                {loading ? <BeatLoader color="#fff"  /> : "ارسال مقاله"}
                          </button>
                    </div>
                </div>
            </div>
      )}


              
    </div>
  );
}

export default UserContent;





// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import axios from "axios";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import { useCookies } from "react-cookie";
// import toast, { Toaster } from "react-hot-toast";
// import { BeatLoader, ClipLoader } from "react-spinners";

// function UserContent() {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [textInput, setTextInput] = useState("");
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [richText, setRichText] = useState(""); 
//   const [loading, setLoading] = useState(false);
//   const [imageLoading, setImageLoading] = useState(false);
//   const [cookies] = useCookies(["access_token"]);
//   const [textInputError, setTextInputError] = useState("");
//   const [imageError, setImageError] = useState("");

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/categories");
//         const categoryOptions = response.data.categories.map((category) => ({
//           value: category.name,
//           label: category.name,
//         }));
//         setCategories(categoryOptions);
//       } catch (error) {
//         console.error("Error fetching categories:", error.response || error.message);
//       }
//     };

//     fetchCategories();
//   }, []);

 
//   const handleTextInputChange = (e) => {
//     const value = e.target.value;
//     const persianRegex = /^[\u0600-\u06FF\s]*$/;

//     if (persianRegex.test(value) || value === "") {
//       setTextInput(value);
//       setTextInputError("");
//     } else {
//       setTextInputError("کیبورد خود را فارسی کنید.");
//     }
//   };


//   const handleRichTextChange = (value) => {
//     setRichText(value); 
//   };

 
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validFormats = ["image/jpeg", "image/png"];
//       if (!validFormats.includes(file.type)) {
//         setImageError("فرمت عکس باید jpg یا png باشد.");
//         return;
//       }

//       setImageError("");
//       setImageLoading(true);
//       setTimeout(() => {
//         setUploadedImage(URL.createObjectURL(file));
//         setImageFile(file);
//         setImageLoading(false);
//       }, 500);
//     }
//   };


//   const handleSubmit = async () => {
//     if (!textInput || !richText || !imageFile || selectedCategories.length === 0) {
//       toast.error("پر کردن همه فیلدها الزامی است.");
//       return;
//     }
  
//     setLoading(true);
  
 
//     const plainText = richText.replace(/<\/?p>/g, "");
  
//     const formData = new FormData();
//     const categoriesList = selectedCategories.map((cat) => cat.value).join(",");
  
//     formData.append("categories_list", categoriesList);
//     formData.append("title", textInput);
//     formData.append("text", plainText);  
//     formData.append("file", imageFile);
  
//     try {
//       const response = await axios.post("http://localhost:8000/createArticles", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${cookies.access_token}`,
//         },
//       });
  
//       console.log("Article created successfully:", response.data);
//       toast.success("مقاله با موفقیت ارسال شد");
  
//       setTextInput("");
//       setSelectedCategories([]);
//       setRichText("");
//       setUploadedImage(null);
//       setImageFile(null);
//     } catch (error) {
//       console.error("Error creating article:", error.response?.data || error.message);
//       toast.error("ارسال مقاله با مشکل مواجه شد.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="UserContent_container">
//       <Toaster  position="top-center" reverseOrder={false} />
//       <h2 className="UserContent_container_h">مدیریت دسته‌بندی‌ها</h2>

//       <div className="UserContent_container_div">
//         <div className="UserContent_container_multiselect">
//           <p className="UserContent_container_multiselect_p">گزینه‌های موردنظر خود را انتخاب کنید:</p>
//           <Select
//             isMulti
//             options={categories}
//             value={selectedCategories}
//             onChange={(selected) => setSelectedCategories(selected)}
//             placeholder="دسته‌بندی‌ها را انتخاب کنید"
//             className="UserContent_container_multiselect_Select"
//           />
//         </div>

  
//         <div className="UserContent_input_container">
//           <label className="UserContent_input_label">
//             <p className="UserContent_input_p">عنوان مقاله:</p>
//             <input
//               type="text"
//               value={textInput}
//               onChange={handleTextInputChange}
//               placeholder="عنوان مقاله را وارد کنید"
//               className="UserContent_text_input"
//             />
//           </label>
//           {textInputError && <p className="UserContent_error">{textInputError}</p>}
//         </div>

      
//         <div className="UserContent_upload_container">
//           <label className="UserContent_upload_label">
//             <p className="UserContent_upload_p">عکس خود را آپلود کنید:</p>
//             <input type="file" accept="image/*" onChange={handleImageUpload} className="UserContent_upload_input" />
//           </label>
//           {imageError && <p className="UserContent_upload_error">{imageError}</p>}
//           {imageLoading ? (
//             <ClipLoader />
//           ) : (
//             uploadedImage && (
//               <div className="UserContent_uploaded_image">
//                 <p  className="UserContent_uploaded_image_p">پیش‌نمایش عکس:</p>
//                 <img src={uploadedImage} alt="Uploaded preview" className="UserContent_uploaded_image_img" />
//               </div>
//             )
//           )}
//         </div>

      
//         <div className="UserContent_rich_text">
//           <p className="UserContent_rich_text_p">متن خود را بنویسید:</p>
//           <ReactQuill
//             value={richText}
//             onChange={handleRichTextChange}
//             placeholder="متن خود را در اینجا بنویسید"
//              className="UserContent_ReactQuill"
//           />
//         </div>

  
//         <div className="UserContent_submit_container">
//           {loading ? (
//             <BeatLoader />
//           ) : (
//             <div className="UserContent_button">
//                 <button onClick={handleSubmit} className="UserContent_submit_button">
//                   ارسال مقاله
//                 </button>
//             </div>
//           )}
//         </div>
//      </div>
//     </div>
//   );
// }

// export default UserContent;







