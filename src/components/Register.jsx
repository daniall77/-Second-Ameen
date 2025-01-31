import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader } from "react-spinners"; 

function Register() {
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); 

  const handleRegister = (data) => {
    const { username, firstName, lastName } = data;

    if (!username || !/^09\d{9}$/.test(username)) {
      setError('username', {
        type: 'manual',
        message: 'فرمت شماره موبایل نادرست است',
      });
      return;
    }

    const requestData = {
      phone_number: username,
      first_name: firstName,
      last_name: lastName,
    };
    
    setIsLoading(true); 
    axios.post('http://localhost:8000/signup', requestData)
      .then((response) => {
        console.log('Response from server:', response.data);
        navigate('/VerifyRegister', { state: { phone_number: username } });
      })
      .catch((error) => {
        console.error('Error during registration:', error);

        if (error.response && error.response.status === 400) {
         
          toast.error('این کاربر با این شماره موبایل قبلاً ثبت‌نام کرده است');
        } else {
          toast.error('خطایی رخ داده است. لطفاً دوباره تلاش کنید');
        }
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

  const handleNameInput = (e, field) => {
    const value = e.target.value;
    const regex = /^[\u0600-\u06FF\s]*$/;

    if (!regex.test(value)) {
      e.target.value = value.replace(/[^\u0600-\u06FF\s]/g, '');
      setError(field, {
        type: 'manual',
        message: 'کیبورد خود را فارسی کنید',
      });
    } else {
      clearErrors(field);
    }
  };

  return (
    <div className="Register_container">
       <Toaster position="top-center" reverseOrder={false} />
      <div className="Register_box">
        <h2 className="Register_h">ثبت‌نام</h2>
        <form className="Register_form" onSubmit={handleSubmit(handleRegister)}>


          <div className="Register_form_div">
            <input
              type="text"
              placeholder="نام"
              className="Register_form_input"
              autoComplete="off"
              {...register('firstName', { required: 'این فیلد را پر کنید' })}
              onInput={(e) => handleNameInput(e, 'firstName')}
            />
            {errors.firstName && (
              <div className="Register_div_errors">{errors.firstName.message}</div>
            )}
          </div>

          <div className="Register_form_div">
            <input
              type="text"
              placeholder="نام خانوادگی"
              className="Register_form_input"
              autoComplete="off"
              {...register('lastName', { required: 'این فیلد را پر کنید' })}
              onInput={(e) => handleNameInput(e, 'lastName')}
            />
            {errors.lastName && (
              <div className="Register_div_errors">{errors.lastName.message}</div>
            )}
          </div>
          <div className="Register_form_div">
            <input
              type="text"
              placeholder="شماره موبایل"
              className="Register_form_input"
              autoComplete="off"
              {...register('username', { required: 'این فیلد را پر کنید' })}
              onInput={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length > 11) {
                  e.target.value = value.slice(0, 11);
                } else {
                  e.target.value = value;
                }
              }}
            />
            {errors.username && (
              <div className="Register_div_errors">{errors.username.message}</div>
            )}
          </div>

          <div className="Register_button_div">
              <button
                className="Register_button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <BeatLoader />
                ) : (
                  'ثبت‌نام'
                )}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;









// 111111111111111111111111111111111111111111111111111111111111111

// import React , { useState }  from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import toast, { Toaster } from "react-hot-toast";

// function Register() {
//   const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false); 


//   const handleRegister = (data) => {
//     const { username, firstName, lastName } = data;

//     if (!username || !/^09\d{9}$/.test(username)) {
//       setError('username', {
//         type: 'manual',
//         message: 'فرمت شماره موبایل نادرست است',
//       });
//       return;
//     }

//     const requestData = {
//       phone_number: username,
//       first_name: firstName,
//       last_name: lastName,
//     };
    
//     setIsLoading(true); 
//     axios.post('http://localhost:8000/signup', requestData)
//       .then((response) => {
//         console.log('Response from server:', response.data);
//         navigate('/VerifyRegister', { state: { phone_number: username } });
//       })
//       .catch((error) => {
//         console.error('Error during registration:', error);

        
//         if (error.response && error.response.status === 400) {
//           setError('username', {
//             type: 'manual',
//             message: 'این کاربر با این شماره موبایل قبلاً ثبت‌نام کرده است',
//           });
//         } else {
//           toast.error('خطایی رخ داده است. لطفاً دوباره تلاش کنید');
//         }
//       })
//       .finally(() => {
//         setIsLoading(false); 
//       });
//   };

//   const handleNameInput = (e, field) => {
//     const value = e.target.value;
//     const regex = /^[\u0600-\u06FF\s]*$/;

//     if (!regex.test(value)) {
//       e.target.value = value.replace(/[^\u0600-\u06FF\s]/g, '');
//       setError(field, {
//         type: 'manual',
//         message: 'کیبورد خود را فارسی کنید',
//       });
//     } else {
//       clearErrors(field);
//     }
//   };

  
//   return (
//     <div className="Register_container">
//        <Toaster position="top-center" reverseOrder={false} />
//       <div className="Register_box">
//         <h2 className="Register_h">ثبت‌نام</h2>
//         <form className="Register_form" onSubmit={handleSubmit(handleRegister)}>
//           <div className="Register_form_div" >
//             <input
//               type="text"
//               placeholder="شماره موبایل"
//               className="Register_form_input"
//               autoComplete="off"
//               {...register('username', { required: 'این فیلد را پر کنید' })}
//               onInput={(e) => {
//                 const value = e.target.value.replace(/[^0-9]/g, '');
//                 if (value.length > 11) {
//                   e.target.value = value.slice(0, 11);
//                 } else {
//                   e.target.value = value;
//                 }
//               }}
//             />
//             {errors.username && (
//               <div className="Register_div_errors" >{errors.username.message}</div>
//             )}
//           </div>

//           <div className="Register_form_div" >
//             <input
//               type="text"
//               placeholder="نام"
//               className="Register_form_input"
//               autoComplete="off"
//               {...register('firstName', { required: 'این فیلد را پر کنید' })}
//               onInput={(e) => handleNameInput(e, 'firstName')}
//             />
//             {errors.firstName && (
//               <div className="Register_div_errors" >{errors.firstName.message}</div>
//             )}
//           </div>

//           <div className="Register_form_div" >
//             <input
//               type="text"
//               placeholder="نام خانوادگی"
//               className="Register_form_input"
//               autoComplete="off"
//               {...register('lastName', { required: 'این فیلد را پر کنید' })}
//               onInput={(e) => handleNameInput(e, 'lastName')}
//             />
//             {errors.lastName && (
//               <div className="Register_div_errors" >{errors.lastName.message}</div>
//             )}
//           </div>
//           <div className="Register_button_div">
//               <button
//                 className="Register_button"
//                 type="submit"
//                 disabled={isLoading} 
//               >
//                     {isLoading ? 'در حال ارسال کد...' : 'ثبت‌نام'}
//               </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;



