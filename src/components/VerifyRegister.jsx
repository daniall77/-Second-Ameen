import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import { BeatLoader } from "react-spinners";

function VerifyRegister() {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['access_token']);
  const [timer, setTimer] = useState(120);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phone_number;
  const inputsRef = useRef([]);
  const toastShown = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!toastShown.current) {
      toast.success(`کد تأیید به شماره ${phoneNumber}ارسال شد`, { duration: 4000 });
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

    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/verify?phone_number=${encodeURIComponent(phoneNumber)}&verification_code=${encodeURIComponent(code)}`
      );

      console.log('Verification response:', response.data);

      if (response.data && response.data.access_token) {
        setCookie('access_token', response.data.access_token, { path: '/', maxAge: 31536000 });

        
        navigate('/', { state: { successMessage: 'ثبت نام با موفقیت انجام شد' } });
      }
    } catch (error) {
      console.error('Verification error:', error);

      if (error.response && error.response.status === 400) {
        toast.error('کد تأیید نادرست است', { duration: 4000 });
       
      } else {
        toast.error('خطایی رخ داده است. لطفاً دوباره تلاش کنید', { duration: 4000 });
       
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true); 
    try {
      const responseAgain = await axios.post(
        `http://localhost:8000/login?phone_number=${encodeURIComponent(phoneNumber)}`
      );

      console.log('Verification response:', responseAgain.data);

      if (responseAgain.data && responseAgain.data.access_token) {
        setCookie('access_token', responseAgain.data.access_token, { path: '/', maxAge: 31536000 });

        navigate('/', { state: { successMessage: 'ثبت نام با موفقیت انجام شد' } });
      }
    } catch (error) {
      console.error('Verification error:', error);

      if (error.response && error.response.status === 400) {
        toast.error('کد تأیید نادرست است', { duration: 4000 });
        
      } else {
        toast.error('خطایی رخ داده است. لطفاً دوباره تلاش کنید', { duration: 4000 });
        
      }
    } finally {
      setIsResending(false); 
    }

    startTimer();
    toast.success(`کد تأیید جدید به شماره ${phoneNumber}ارسال شد`, { duration: 4000 });
  };

  return (
    <div className="Verify_container" >
      <Toaster  className="Verify_container_Toaster" position="top-center" reverseOrder={false} />
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
          <div className="Verify_text">ارسال مجدد کد تا {timer} ثانیه دیگر</div>
        ) : (
          <div className="Verify_div_button_one">
            <button type="button" className="Verify_button_one" onClick={handleResendCode} disabled={isResending}>
              {isResending ? <BeatLoader color="#fff"  /> : 'ارسال مجدد کد'}
            </button>
          </div>
        )}
        {errorMessage && <div className="Verify_div_error">{errorMessage}</div>}
        <div className="Verify_div_button_two">
          <button
            type="button"
            className="Verify_button_two"
            onClick={() => handleVerify(verificationCode.join(''))}
            disabled={isVerifyDisabled || isLoading}
          >
            {isLoading ? <BeatLoader color="#fff"  /> : 'تأیید'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyRegister;





