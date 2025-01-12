import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

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
      alert("لطفاً یک فایل انتخاب کنید!");
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>آپلود تصویر پروفایل</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="file"
            accept=".jpg,.png"
            onChange={handleFileChange}
            style={{ marginBottom: "15px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          ثبت
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "20px",
            color: message.includes("خطا") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Image;







