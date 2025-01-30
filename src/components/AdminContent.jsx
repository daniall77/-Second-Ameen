import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader, ClipLoader } from "react-spinners";

function AdminContent() {


  const [topics, setTopics] = useState([]); 
  const [newTopic, setNewTopic] = useState(""); 

//   main
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
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://localhost:8000/categories");
        console.log(response.data);
        setTopics(response.data.categories); 
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast.error("خطا در دریافت موضوعات");
      }
    };

    fetchTopics();
  }, [cookies.access_token]);

  const handleAddTopic = async () => {
    if (newTopic.trim() === "") {
      toast.error("لطفاً یک موضوع وارد کنید!");
      return;
    }

    if (topics.some((topic) => topic.name === newTopic.trim())) {
      toast.error("این موضوع قبلاً اضافه شده است");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/categories/create",
        { name: newTopic.trim() },
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      console.log(response.data);
      setTopics([...topics, response.data]);
      setNewTopic("");
      toast.success("موضوع با موفقیت اضافه شد");
    } catch (error) {
      console.error("Error adding topic:", error.response || error.message);
      toast.error("خطا در اضافه کردن موضوع");
    }
  };



//     main

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

    const formData = new FormData();
    const categoriesList = selectedCategories.map((cat) => cat.value).join(",");

    formData.append("categories_list", categoriesList);
    formData.append("title", textInput);
    formData.append("text", richText);
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
      toast.error("ارسال مقاله با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AdminContent_container">
      <Toaster className="Verify_Toaster" position="top-center" reverseOrder={false} />



      <h2 className="dashboard-title">مدیریت موضوعات</h2>

      <div className="topic-input">
        <input
          type="text"
          placeholder="یک موضوع جدید اضافه کنید..."
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          className="input-box"
        />
        <button onClick={handleAddTopic} className="add-button">
          + افزودن
        </button>
      </div>

      <h3>لیست موضوعات:</h3>
      <ul>
        {topics.length > 0 ? (
          topics.map((topic) => <li key={topic.id}>{topic.name}</li>)
        ) : (
          <p>هیچ موضوعی یافت نشد</p>
        )}
      </ul>



{/* main */}

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
            onChange={handleTextInputChange}
            placeholder="عنوان مقاله را وارد کنید"
            className="text-input"
          />
        </label>
        {textInputError && <p className="error">{textInputError}</p>}
      </div>

    
      <div className="upload-container">
        <label>
          <p>عکس خود را آپلود کنید:</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        {imageError && <p className="error">{imageError}</p>}
        {imageLoading ? (
          <ClipLoader color="#4A90E2" size={15} />
        ) : (
          uploadedImage && (
            <div className="uploaded-image">
              <p>پیش‌نمایش عکس:</p>
              <img src={uploadedImage} alt="Uploaded preview" width="200" />
            </div>
          )
        )}
      </div>

    
      <div className="rich-text-container">
        <p>متن خود را بنویسید:</p>
        <ReactQuill
          value={richText}
          onChange={handleRichTextChange}
          placeholder="متن خود را در اینجا بنویسید"
        />
      </div>

 
      <div className="submit-container">
        {loading ? (
          <BeatLoader />
        ) : (
          <button onClick={handleSubmit} className="submit-button">
            ارسال مقاله
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminContent;


// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import axios from "axios";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import { useCookies } from "react-cookie";
// import toast, { Toaster } from "react-hot-toast";
// import { BeatLoader, ClipLoader } from "react-spinners";

// function AdminContent() {
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
//         setImageError("فرمت عکس باید jpg یا png باشد");
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

//     const formData = new FormData();
//     const categoriesList = selectedCategories.map((cat) => cat.value).join(",");

//     formData.append("categories_list", categoriesList);
//     formData.append("title", textInput);
//     formData.append("text", richText);
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
//     <div className="AdminContent_container">
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2>مدیریت دسته‌بندی‌ها</h2>

     
//       <div className="multiselect-container">
//         <p>گزینه‌های موردنظر خود را انتخاب کنید:</p>
//         <Select
//           isMulti
//           options={categories}
//           value={selectedCategories}
//           onChange={(selected) => setSelectedCategories(selected)}
//           placeholder="دسته‌بندی‌ها را انتخاب کنید"
//         />
//       </div>

 
//       <div className="input-container">
//         <label>
//           <p>عنوان مقاله:</p>
//           <input
//             type="text"
//             value={textInput}
//             onChange={handleTextInputChange}
//             placeholder="عنوان مقاله را وارد کنید"
//             className="text-input"
//           />
//         </label>
//         {textInputError && <p className="error">{textInputError}</p>}
//       </div>

    
//       <div className="upload-container">
//         <label>
//           <p>عکس خود را آپلود کنید:</p>
//           <input type="file" accept="image/*" onChange={handleImageUpload} />
//         </label>
//         {imageError && <p className="error">{imageError}</p>}
//         {imageLoading ? (
//           <ClipLoader color="#4A90E2" size={15} />
//         ) : (
//           uploadedImage && (
//             <div className="uploaded-image">
//               <p>پیش‌نمایش عکس:</p>
//               <img src={uploadedImage} alt="Uploaded preview" width="200" />
//             </div>
//           )
//         )}
//       </div>

    
//       <div className="rich-text-container">
//         <p>متن خود را بنویسید:</p>
//         <ReactQuill
//           value={richText}
//           onChange={handleRichTextChange}
//           placeholder="متن خود را در اینجا بنویسید"
//         />
//       </div>

 
//       <div className="submit-container">
//         {loading ? (
//           <BeatLoader />
//         ) : (
//           <button onClick={handleSubmit} className="submit-button">
//             ارسال مقاله
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminContent;

