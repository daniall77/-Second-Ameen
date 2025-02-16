import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { ScaleLoader, BeatLoader } from "react-spinners";

function EditorListPhone() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId } = location.state || {};
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPhone, setLoadingPhone] = useState(null); 

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/answers/descriptive/${examId}`, {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        });

        setPhoneNumbers(response.data.data);
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("هیچ پاسخ تصحیح‌نشده‌ای برای این آزمون یافت نشد");
        } else {
          toast.error("خطا در دریافت لیست شرکت‌کنندگان");
        }
        console.error("خطا", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [examId]);

  const handleViewAnswers = (phoneNumber) => {
    setLoadingPhone(phoneNumber); 
    setTimeout(() => {
      navigate(`/Dashboard/ListExam/ListPhone/Correcting`, { state: { examId, phoneNumber } });
      setLoadingPhone(null);
    }, 1000);
  };

  return (
        <div className="AdminListPhone_container">
            <Toaster className="AdminListPhone_Toaster" position="top-center" reverseOrder={false} />

            <header className="AdminListPhone_header">
                <h2 className="AdminListPhone_header_h" >شرکت‌کنندگان آزمون {examId}</h2>
            </header>

            {isLoading ? (
                <div className="AdminListPhone_loader_container">
                  <ScaleLoader className="AdminListPhone_ScaleLoader" />
                </div>
                ) : phoneNumbers.length > 0 ? (
                <section className="AdminListPhone_participants_section">
                    {phoneNumbers.map((phone) => (
                    <article key={phone} className="AdminListPhone_participant_card">
                        <header className="AdminListPhone_participant_info">
                            <p className="AdminListPhone_participant_info_p"><strong className="AdminListPhone_participant_info_strong">شماره تلفن:</strong> {phone}</p>
                        </header>

                        <footer className="AdminListPhone_participant_footer">
                            <button
                              className="AdminListPhone_view_answers_button"
                              onClick={() => handleViewAnswers(phone)}
                              disabled={loadingPhone === phone}
                              >
                                  {loadingPhone === phone ? <BeatLoader className="AdminListPhone_BeatLoader" /> : "مشاهده پاسخ‌ها"}
                              </button>
                        </footer>
                  </article>
                ))}
                </section>
              ) : (
              <p className="AdminListPhone_no_participants_message">
                    هیچ پاسخ تصحیح‌نشده‌ای برای این آزمون یافت نشد
              </p>
            )}
        </div>
  );
}

export default EditorListPhone;



// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { useCookies } from "react-cookie";

// function EditorListPhone() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { examId } = location.state || {}; 
//   const [phoneNumbers, setPhoneNumbers] = useState([]); 
//   const [cookies] = useCookies(["access_token"]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {


//     const fetchParticipants = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(`http://localhost:8000/answers/descriptive/${examId}`, {
//           headers: { Authorization: `Bearer ${cookies.access_token}` },
//         });

//         console.log(` شرکت‌کنندگان آزمون ${examId}:`, response.data.data);
//         setPhoneNumbers(response.data.data);
//       } catch (error) {
//         if (error.response?.status === 404) {
//           toast.error(" هیچ پاسخ تصحیح‌نشده‌ای برای این آزمون یافت نشد!");
//         } else {
//           toast.error(" خطا در دریافت لیست شرکت‌کنندگان");
//         }
//         console.error(" خطا:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchParticipants();
//   }, [examId]);

//   const handleViewAnswers = (phoneNumber) => {
//     navigate(`/Dashboard/ListExam/ListPhone/Correcting`, { state: { examId, phoneNumber } }); 
//   };

//   return (
//     <div className="AdminListPhone_container">
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2>شرکت‌کنندگان آزمون {examId}</h2>

//       {isLoading ? (
//         <p> در حال بارگیری...</p>
//       ) : phoneNumbers.length > 0 ? (
//         phoneNumbers.map((phone) => (
//           <div key={phone} className="participant-card">
//             <p> شماره تلفن: {phone}</p>
//             <button onClick={() => handleViewAnswers(phone)}> مشاهده پاسخ‌ها</button>
//           </div>
//         ))
//       ) : (
//         <p> هیچ پاسخ تصحیح‌نشده‌ای برای این آزمون یافت نشد.</p>
//       )}
//     </div>
//   );
// }

// export default EditorListPhone;
