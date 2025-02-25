import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { ScaleLoader, BeatLoader } from "react-spinners";

function AdminListPhone() {
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
                <h2 className="AdminListPhone_header_h" >شرکت‌کنندگان مسابقه {examId}</h2>
            </header>

            {isLoading ? (
                <div className="Loader_Container">
                     <ScaleLoader color=" #0073e6" height={25}   width={3} />
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
                                  {loadingPhone === phone ? <BeatLoader color="#fff"  /> : "مشاهده پاسخ"}
                              </button>
                        </footer>
                  </article>
                ))}
                </section>
              ) : (
              <p className="AdminListPhone_no_participants_message">
                    هیچ کاربری در این مسابقه شرکت نکرده است
              </p>
            )}
        </div>
  );
}

export default AdminListPhone;

