import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader } from "react-spinners"; 

function Login() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); 

  const handleLogin = (data) => {
    const { username } = data;

    if (!username) {
      setError("username", {
        type: "manual",
        message: "این فیلد را پر کنید",
      });
      return;
    }

    if (!/^09\d{9}$/.test(username)) {
      setError("username", {
        type: "manual",
        message: "فرمت شماره موبایل نادرست است ",
      });
      return;
    }

    setIsLoading(true);

    axios
      .post(`http://localhost:8000/login?phone_number=${encodeURIComponent(username)}`)
      .then((response) => {
        console.log(response.data);
        navigate("/VerifyLogin", { state: { phone_number: username } });
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error("این شماره موبایل یافت نشد لطفاً ثبت‌نام کنید");
        } else {
          toast.error("خطای ناشناخته! لطفاً دوباره تلاش کنید");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 11) {
      e.target.value = value.slice(0, 11);
    } else {
      e.target.value = value;
    }
  };

  return (
    <div className="Login_container" dir="rtl">
      <Toaster className="Login_container_Toaster" position="top-center" reverseOrder={false} />

      <div className="Login_box">
        <h2 className="Login_h">ورود</h2>
        <h2 className="Login_h_title">
          حساب کاربری ندارید؟{" "}
          <Link to="/Register" className="Login_h_link Login_h_title">
            ثبت نام کنید
          </Link>
        </h2>
        <form className="Login_form" onSubmit={handleSubmit(handleLogin)}>
          <div className="Login_form_div">
            <input
              type="text"
              placeholder="شماره موبایل"
              className="Login_form_input"
              autoComplete="off"
              {...register("username", { required: "این فیلد را پر کنید" })}
              onInput={handleInput}
            />
            {errors.username && (
              <div className="Login_div_errors">{errors.username.message}</div>
            )}
          </div>
          <div className="Login_button_div">
            <button
              type="submit"
              className="Login_button"
              disabled={isLoading}
            >
              {isLoading ? (
                <BeatLoader  className="Login_button_div_BeatLoader"  />
              ) : (
                "ورود"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;





// 11111111111111111111111111111111111111111111111111111111111111

// import React , { useState }  from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";

// function Login() {
//   const { register, handleSubmit, setError, formState: { errors } } = useForm();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false); 


//   const handleLogin = (data) => {
//     const { username } = data;

//     if (!username) {
//       setError("username", {
//         type: "manual",
//         message: "این فیلد را پر کنید",
//       });
//       return;
//     } 

//     if (!/^09\d{9}$/.test(username)) {
//       setError("username", {
//         type: "manual",
//         message: "فرمت شماره موبایل نادرست است ",
//       });
//       return;
//     }

//     setIsLoading(true);

    
//     axios
//     .post(`http://localhost:8000/login?phone_number=${encodeURIComponent(username)}`)
//     .then((response) => { 
//       console.log(response.data);
//       navigate("/VerifyLogin", { state: { phone_number: username } });
//     })
//     .catch((error) => {
      
//       if (error.response && error.response.status === 400) {
//         setError("username", {
//           type: "manual",
//           message: "این شماره موبایل یافت نشد. لطفاً ثبت‌نام کنید",
//         });
//       } else {
//         toast.error("خطای ناشناخته! لطفاً دوباره تلاش کنید");
//       }
//     })
//     .finally(() => {
//       setIsLoading(false); 
//     });

    
//   };

//   const handleInput = (e) => {
//     const value = e.target.value.replace(/[^0-9]/g, "");
//     if (value.length > 11) {
//       e.target.value = value.slice(0, 11);
//     } else {
//       e.target.value = value;
//     }
//   };

  
//   return (
//     <div className="Login_container">
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="Login_background_circle one"></div>
//       <div className="Login_background_circle two"></div>
  
//       <div className="Login_box">
//         <h2 className="Login_h">ورود</h2>
//         <h2 className="Login_h">
//           حساب کاربری ندارید؟{" "}
//           <Link to="/Register" className="Login_h_link">
//             ثبت نام کنید
//           </Link>
//         </h2>
//         <form className="Login_form" onSubmit={handleSubmit(handleLogin)}>
//           <div className="Login_form_div">
//             <input
//               type="text"
//               placeholder="شماره موبایل"
//               className="Login_form_input"
//               autoComplete="off"
//               {...register("username", { required: "این فیلد را پر کنید" })}
//               onInput={handleInput}
//             />
//             {errors.username && (
//               <div className="Login_div_errors">{errors.username.message}</div>
//             )}
//           </div>
//           <div className="Login_button_div">
//                 <button
//                   type="submit"
//                   className="Login_button"
//                   disabled={isLoading} 
//                 >
//                           {isLoading ? "در حال ارسال کد..." : "ورود"}
//                 </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;



