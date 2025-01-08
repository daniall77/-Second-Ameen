import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useCookies } from 'react-cookie';

function VerifyLogin() {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['access_token']);
  const [timer, setTimer] = useState(120);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phone_number;
  const inputsRef = useRef([]);
  const toastShown = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!toastShown.current) {
      toast.success(`کد تأیید به شماره ${phoneNumber} ارسال شد`, { duration: 9000 });
      toastShown.current = true;
    }

    startTimer();
    
    return () => clearInterval(timerRef.current);
  }, [phoneNumber]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimer(120);
    setIsVerifyDisabled(false); 
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsVerifyDisabled(true); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (index, value) => {
    if (/[^0-9]/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }

    if (index === 3 && newCode.every((digit) => digit)) {
      handleVerify(newCode.join(''));
    }
  };

  const handleVerify = async (code) => {
    if (isVerifyDisabled) return; 

    if (!code) {
      setErrorMessage('لطفاً کد تأیید را وارد کنید');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/verify?phone_number=${encodeURIComponent(phoneNumber)}&verification_code=${encodeURIComponent(code)}`
      );

      console.log('Verification response:', response.data);

      if (response.data && response.data.access_token) {
        toast.success( 'با موفقیت وارد شدید' , { duration: 2000 });

        setCookie('access_token', response.data.access_token, { path: '/'});

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);

      if (error.response && error.response.status === 400) {
        toast.error('کد تأیید نادرست است یا کاربر پیدا نشد', { duration: 4000 });
        setErrorMessage('کد تأیید نادرست است یا کاربر پیدا نشد');
      } else {
        toast.error('خطایی رخ داده است. لطفاً دوباره تلاش کنید', { duration: 4000 });
        setErrorMessage('خطایی رخ داده است. لطفاً دوباره تلاش کنید');
      }
    }
  };

  const handleResendCode = () => {
    
    try {
      const responseAgain = axios.post(
        `http://localhost:8000/login?phone_number=${encodeURIComponent(phoneNumber)}`
      );

      console.log('Verification response:', responseAgain.data);

      if (responseAgain.data && responseAgain.data.access_token) {
        toast.success('ثبت نام با موفقیت انجام شد', { duration: 2000 });

        setCookie('access_token', responseAgain.data.access_token, { path: '/' });
     
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);

      if (error.response && error.response.status === 400) {
        toast.error('کد تأیید نادرست است یا کاربر پیدا نشد', { duration: 4000 });
        setErrorMessage('کد تأیید نادرست است یا کاربر پیدا نشد');
      } else {
        toast.error('خطایی رخ داده است. لطفاً دوباره تلاش کنید', { duration: 4000 });
        setErrorMessage('خطایی رخ داده است. لطفاً دوباره تلاش کنید');
      }
    }

    
    startTimer(); 
    toast.success(`کد تأیید جدید به شماره ${phoneNumber} ارسال شد`, { duration: 4000 });
  };

  return (
    <div className="Verify_container">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="Verify_box">
        <h2 className="Verify_h">کد تأیید برای شماره موبایل {phoneNumber} ارسال شد</h2>
        <div className="Verify_input_container">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="Verify_input"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        {timer > 0 ? (
          <div style={{ color: 'gray', marginTop: '10px' }}>ارسال مجدد کد تا {timer} ثانیه دیگر</div>
        ) : (
          <button type="button" className="ResendCodeButton" onClick={handleResendCode}>
            ارسال مجدد کد
          </button>
        )}
        {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
        <button
          type="button"
          className="Verify_submit"
          onClick={() => handleVerify(verificationCode.join(''))}
          disabled={isVerifyDisabled}
        >
          تأیید
        </button>
      </div>
    </div>
  );
}

export default VerifyLogin;






