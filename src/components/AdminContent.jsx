import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { ScaleLoader, BeatLoader, ClipLoader } from "react-spinners";
import { LuCirclePlus } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";



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


  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);




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
      setError("نام کتگوری نباید خالی باشد");
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
    } finally {
      setPageLoading(false);
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

        <>
                    {/* section1 */}
                        <div className="AdminContent_box">
                            <div className="AdminContent_container_one">
                                  <button  className="AdminContent_button_one"   onClick={() => setIsOpen(true)} >
                                          افزودن دسته بندی
                                  </button>
                            </div>
                        </div>

                        {isOpen && (
                          <div className="AdminContent_modal">
                            <div className="AdminContent_modal_overlay" onClick={() => setIsOpen(false)}></div>
                            <div className="AdminContent_modal_content">
                                <div className="AdminContent_header">
                                    <h2 className="AdminContent_header_h" >افزودن کتگوری</h2>
                                    <button className="AdminContent_header_button"  onClick={() => setIsOpen(false)}>
                                            <IoClose className="AdminContent_IoClose" />
                                    </button>
                                </div>

                            
                              {error && <p className="AdminContent_modal_error" >{error}</p>}

                              <div className="AdminContent_modal_main">
                                <input
                                  type="text"
                                  placeholder="نام کتگوری"
                                  value={category}
                                  onChange={(e) => setCategory(e.target.value)}
                                  className="AdminContent_modal_input"
                                />
                                <button className="AdminContent_modal_button" onClick={handleAddSubcategory}>
                                  <LuCirclePlus className="AdminContent_LuCirclePlus" />
                                </button>
                              </div>

                            
                              {subcategories.length > 0 &&
                                subcategories.map((sub, index) => (
                                  <div className="AdminContent_modal_section" key={index}>
                                    <input
                                      type="text"
                                      placeholder="نام ساب‌کتگوری"
                                      value={sub}
                                      className="AdminContent_modal_section_input"
                                      onChange={(e) =>
                                        handleChangeSubcategory(index, e.target.value)
                                      }
                                    />
                                    <button className="AdminContent_modal_section_button" onClick={() => handleRemoveSubcategory(index)}>
                                      <FiTrash className="AdminContent_FiTrash" />
                                    </button>
                                  </div>
                                ))}

                              <div className="AdminContent_modal_div">
                                  <button className="AdminContent_modal_div_button" onClick={handleSubmitTest}  disabled={loading} >
                                        {loading ? <BeatLoader color="#fff"  /> : " ثبت"}
                                  </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* section1 */}

                        {/* section2 */}

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
                                        {imageLoading ? <ClipLoader color=" #0073e6" /> : imagePreview && <img src={imagePreview} alt="Preview" className="AdminContent_image_preview" />}
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
                                            {loading ? <BeatLoader className="AdminContent_BeatLoader" /> : "ارسال مقاله"}
                                      </button>
                                </div>
                        </div>
                      </div>
                        {/* section2 */}
        </>
      )}

    </div>
  );
}

export default AdminContent;









