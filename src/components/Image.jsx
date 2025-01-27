import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";

function Image() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(""); 
  const [cookies] = useCookies(["access_token"]); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedFile) {
      toast.error("لطفاً یک فایل انتخاب کنید!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      const response = await axios.post(
        "http://localhost:8000/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
  
      if (response.status === 200) {
        setMessage("تصویر با موفقیت ارسال شد!");
    
        window.location.reload();
      } else {
        setMessage("مشکلی در آپلود تصویر وجود دارد.");
      }
    } catch (error) {
      console.error("خطا در ارسال تصویر:", error);
      setMessage("خطا در ارسال تصویر به سرور.");
    }
  };
  
  

  return (
    <div className="Image_container">
       
       <Toaster position="top-center" reverseOrder={false} />

      <h1 className="Image_h">آپلود تصویر پروفایل</h1>
      <form className="Image_form" onSubmit={handleSubmit}>
        <div className="Image_form_div" >
          <input
            type="file"
            accept=".jpg,.png"
            onChange={handleFileChange}
            className="Image_form_div_input"
          />
        </div>
        <div className="Image_form_div_button">
              <button
                type="submit"
                className="Image_form_button"
              >
                ثبت
              </button>
        </div>
      </form>
      {message && (
        <p
            className="Image_p"
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Image;







