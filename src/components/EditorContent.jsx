import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useCookies } from "react-cookie";


function EditorContent() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); 
  const [richText, setRichText] = useState("");
  const [cookies] = useCookies(["access_token"]); 


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/categories");
        const categoryOptions = response.data.categories.map((category) => ({
          value: category.name,
          label: category.name,
        }));
        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error fetching categories:", error.response || error.message);
      }
    };

    fetchCategories();
  }, []);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setImageFile(file); 
    }
  };


  const handleSubmit = async () => {
    const formData = new FormData();

    const categoriesList = selectedCategories.map((cat) => cat.value).join(",");

    formData.append("categories_list", categoriesList);
    formData.append("title", textInput);
    formData.append("text", richText);
    formData.append("file", imageFile);
    
    // if (imageFile) {
    //   formData.append("file", imageFile);
    // } else {
    //   alert("لطفاً یک تصویر انتخاب کنید!");
    //   return;
    // }
  
    try {
      const response = await axios.post("http://localhost:8000/createArticles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${cookies.access_token}`, 
        },
      });
      console.log("Article created successfully:", response.data);
      alert("مقاله با موفقیت ارسال شد!");
    } catch (error) {
      console.error("Error creating article:", error.response?.data || error.message);
      alert("ارسال مقاله با مشکل مواجه شد: " + (error.response?.data?.detail || "مشکلی پیش آمد."));
    }
  };
  

  return (
    <div className="AdminContent_container">
      <h2>مدیریت دسته‌بندی‌ها</h2>

      <div className="multiselect-container">
        <p>گزینه‌های موردنظر خود را انتخاب کنید:</p>
        <Select
          isMulti
          options={categories}
          value={selectedCategories}
          onChange={(selected) => setSelectedCategories(selected)}
          placeholder="دسته‌بندی‌ها را انتخاب کنید"
        />
      </div>

      <div className="input-container">
        <label>
          <p>عنوان مقاله:</p>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="عنوان مقاله را وارد کنید"
            className="text-input"
          />
        </label>
      </div>

      <div className="upload-container">
        <label>
          <p>عکس خود را آپلود کنید:</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        {uploadedImage && (
          <div className="uploaded-image">
            <p>پیش‌نمایش عکس:</p>
            <img src={uploadedImage} alt="Uploaded preview" width="200" />
          </div>
        )}
      </div>

      <div className="rich-text-container">
        <p>متن خود را بنویسید:</p>
        <ReactQuill
          value={richText}
          onChange={setRichText}
          placeholder="متن خود را در اینجا بنویسید"
        />
      </div>

      <button onClick={handleSubmit} className="submit-button">
        ارسال مقاله
      </button>
    </div>
  );
}

export default EditorContent;

