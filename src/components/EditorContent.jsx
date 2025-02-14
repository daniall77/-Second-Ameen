import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";


function EditorContent() {

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



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

export default EditorContent;
