import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

function Image() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [cookies, setCookie] = useCookies(["userImage"]); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
   
  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("لطفاً یک تصویر انتخاب کنید");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post("", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const data = response.data;
        alert("تصویر با موفقیت آپلود شد!");
        setCookie("userImage", data.imageUrl, { path: "/"  }); 
      } else {
        alert("خطا در آپلود تصویر.");
      }
    } catch (error) {
      console.error("خطای شبکه:", error);
      alert("مشکلی در اتصال به سرور وجود دارد.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewImage && <img src={previewImage} alt="Preview" />}
      <button onClick={handleSubmit}>ثبت</button>
    </div>
  );
}

export default Image;
