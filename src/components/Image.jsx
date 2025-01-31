import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader, ClipLoader } from "react-spinners";

function Image() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [cookies] = useCookies(["access_token"]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validFormats = ["image/jpeg", "image/png"];
      if (!validFormats.includes(file.type)) {
        setImageError("فرمت عکس باید jpg یا png  باشد");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setImageError("");
      setSelectedFile(file);
      setLoadingPreview(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setLoadingPreview(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("لطفاً یک عکس آپلود کنید");
      return;
    }

    setLoadingUpload(true);

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
        toast.success("تصویر با موفقیت ارسال شد!");
        window.location.reload();
      } else {
        toast.error("مشکلی در آپلود تصویر وجود دارد.");
      }
    } catch (error) {
      console.error("خطا در ارسال تصویر:", error);
      toast.error("خطا در ارسال تصویر به سرور.");
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <div className="Image_container">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="Image_h">آپلود تصویر پروفایل</h1>
      <form className="Image_form" onSubmit={handleSubmit}>
        <div className="Image_form_div">
          <input
            type="file"
            accept=".jpg,.png"
            onChange={handleFileChange}
            className="Image_form_div_input"
          />
          {imageError && <p className="error-message">{imageError}</p>}
        </div>

        <div className="Image_form_div_button">
          <button
            type="submit"
            className="Image_form_button"
            disabled={loadingUpload}
          >
            {loadingUpload ? <BeatLoader /> : "ثبت"}
          </button>

          {loadingPreview ? (
            <ClipLoader  />
          ) : (
            previewUrl && <img src={previewUrl} alt="Preview" className="preview-image" />
          )}
        </div>
      </form>
    </div>
  );
}

export default Image;


// import React, { useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import toast, { Toaster } from "react-hot-toast";

// function Image() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [message, setMessage] = useState(""); 
//   const [cookies] = useCookies(["access_token"]); 

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     if (!selectedFile) {
//       toast.error("لطفاً یک عکس آپلود کنید  ");
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append("file", selectedFile);
  
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/photo",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${cookies.access_token}`,
//           },
//         }
//       );
  
//       if (response.status === 200) {
//         setMessage("تصویر با موفقیت ارسال شد!");
    
//         window.location.reload();
//       } else {
//         setMessage("مشکلی در آپلود تصویر وجود دارد.");
//       }
//     } catch (error) {
//       console.error("خطا در ارسال تصویر:", error);
//       setMessage("خطا در ارسال تصویر به سرور.");
//     }
//   };
  
  

//   return (
//     <div className="Image_container">
       
//        <Toaster position="top-center" reverseOrder={false} />

//       <h1 className="Image_h">آپلود تصویر پروفایل</h1>
//       <form className="Image_form" onSubmit={handleSubmit}>
//         <div className="Image_form_div" >
//           <input
//             type="file"
//             accept=".jpg,.png"
//             onChange={handleFileChange}
//             className="Image_form_div_input"
//           />
//         </div>
//         <div className="Image_form_div_button">
//               <button
//                 type="submit"
//                 className="Image_form_button"
//               >
//                 ثبت
//               </button>
//         </div>
//       </form>
//       {message && (
//         <p
//             className="Image_p"
//         >
//           {message}
//         </p>
//       )}
//     </div>
//   );
// }

// export default Image;







