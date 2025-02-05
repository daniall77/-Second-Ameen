import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader, ClipLoader } from "react-spinners";

function EditorContent() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [richText, setRichText] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [cookies] = useCookies(["access_token"]);
  const [textInputError, setTextInputError] = useState("");
  const [imageError, setImageError] = useState("");

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

 
  const handleTextInputChange = (e) => {
    const value = e.target.value;
    const persianRegex = /^[\u0600-\u06FF\s]*$/;

    if (persianRegex.test(value) || value === "") {
      setTextInput(value);
      setTextInputError("");
    } else {
      setTextInputError("کیبورد خود را فارسی کنید.");
    }
  };


  const handleRichTextChange = (value) => {
    setRichText(value); 
  };

 
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png"];
      if (!validFormats.includes(file.type)) {
        setImageError("فرمت عکس باید jpg یا png باشد");
        return;
      }

      setImageError("");
      setImageLoading(true);
      setTimeout(() => {
        setUploadedImage(URL.createObjectURL(file));
        setImageFile(file);
        setImageLoading(false);
      }, 500);
    }
  };

 
  const handleSubmit = async () => {
    if (!textInput || !richText || !imageFile || selectedCategories.length === 0) {
      toast.error("پر کردن همه فیلدها الزامی است.");
      return;
    }
  
    setLoading(true);
  
 
    const plainText = richText.replace(/<\/?p>/g, "");
  
    const formData = new FormData();
    const categoriesList = selectedCategories.map((cat) => cat.value).join(",");
  
    formData.append("categories_list", categoriesList);
    formData.append("title", textInput);
    formData.append("text", plainText);  
    formData.append("file", imageFile);
  
    try {
      const response = await axios.post("http://localhost:8000/createArticles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
  
      console.log("Article created successfully:", response.data);
      toast.success("مقاله با موفقیت ارسال شد");
  
      setTextInput("");
      setSelectedCategories([]);
      setRichText("");
      setUploadedImage(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error creating article:", error.response?.data || error.message);
      toast.error("ارسال مقاله با مشکل مواجه شد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="UserContent_container">
      <Toaster  position="top-center" reverseOrder={false} />
      <h2 className="UserContent_container_h">مدیریت دسته‌بندی‌ها</h2>

      <div className="UserContent_container_div">
        <div className="UserContent_container_multiselect">
          <p className="UserContent_container_multiselect_p">گزینه‌های موردنظر خود را انتخاب کنید:</p>
          <Select
            isMulti
            options={categories}
            value={selectedCategories}
            onChange={(selected) => setSelectedCategories(selected)}
            placeholder="دسته‌بندی‌ها را انتخاب کنید"
            className="UserContent_container_multiselect_Select"
          />
        </div>

  
        <div className="UserContent_input_container">
          <label className="UserContent_input_label">
            <p className="UserContent_input_p">عنوان مقاله:</p>
            <input
              type="text"
              value={textInput}
              onChange={handleTextInputChange}
              placeholder="عنوان مقاله را وارد کنید"
              className="UserContent_text_input"
            />
          </label>
          {textInputError && <p className="UserContent_error">{textInputError}</p>}
        </div>

      
        <div className="UserContent_upload_container">
          <label className="UserContent_upload_label">
            <p className="UserContent_upload_p">عکس خود را آپلود کنید:</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="UserContent_upload_input" />
          </label>
          {imageError && <p className="UserContent_upload_error">{imageError}</p>}
          {imageLoading ? (
            <ClipLoader />
          ) : (
            uploadedImage && (
              <div className="UserContent_uploaded_image">
                <p  className="UserContent_uploaded_image_p">پیش‌نمایش عکس:</p>
                <img src={uploadedImage} alt="Uploaded preview" className="UserContent_uploaded_image_img" />
              </div>
            )
          )}
        </div>

      
        <div className="UserContent_rich_text">
          <p className="UserContent_rich_text_p">متن خود را بنویسید:</p>
          <ReactQuill
            value={richText}
            onChange={handleRichTextChange}
            placeholder="متن خود را در اینجا بنویسید"
             className="UserContent_ReactQuill"
          />
        </div>

  
        <div className="UserContent_submit_container">
          {loading ? (
            <BeatLoader />
          ) : (
            <div className="UserContent_button">
                <button onClick={handleSubmit} className="UserContent_submit_button">
                  ارسال مقاله
                </button>
            </div>
          )}
        </div>
     </div>
    </div>
  );
}

export default EditorContent;



