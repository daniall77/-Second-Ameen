import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function Register() {
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
  const navigate = useNavigate();


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

    axios.post('http://localhost:8000/signup', requestData)
      .then((response) => {
        console.log('Response from server:', response.data);
        navigate('/VerifyRegister', { state: { phone_number: username } });
      })
      .catch((error) => {
        console.error('Error during registration:', error);

        
        if (error.response && error.response.status === 400) {
          setError('username', {
            type: 'manual',
            message: 'این کاربر با این شماره موبایل قبلاً ثبت‌نام کرده است',
          });
        } else {
          alert('خطایی رخ داده است. لطفاً دوباره تلاش کنید');
        }
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
      <div className="Register_box">
        <h2 className="Register_h">ثبت‌نام</h2>
        <form onSubmit={handleSubmit(handleRegister)}>
          <div>
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
              <div style={{ color: 'red' }}>{errors.username.message}</div>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="نام"
              className="Register_form_input"
              autoComplete="off"
              {...register('firstName', { required: 'این فیلد را پر کنید' })}
              onInput={(e) => handleNameInput(e, 'firstName')}
            />
            {errors.firstName && (
              <div style={{ color: 'red' }}>{errors.firstName.message}</div>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="نام خانوادگی"
              className="Register_form_input"
              autoComplete="off"
              {...register('lastName', { required: 'این فیلد را پر کنید' })}
              onInput={(e) => handleNameInput(e, 'lastName')}
            />
            {errors.lastName && (
              <div style={{ color: 'red' }}>{errors.lastName.message}</div>
            )}
          </div>

          <button type="submit">ثبت‌نام</button>
        </form>
      </div>
    </div>
  );
}

export default Register;



