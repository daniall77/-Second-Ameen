import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Select from "react-select";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader ,  ScaleLoader } from "react-spinners";


function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [schoolError, setSchoolError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [provinceCityData, setProvinceCityData] = useState({
    provinces: [],
    cities: {},
  });
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    const fetchProvinceCityData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/provincecity");
        const { provinces, cities } = response.data;

        const formattedCities = provinces.reduce((acc, province) => {
          acc[province.name] = cities
            .filter((city) => city.province_id === province.id)
            .map((city) => city.name);
          return acc;
        }, {});

        setProvinceCityData({
          provinces: provinces.map((province) => province.name),
          cities: formattedCities,
        });
      } catch (error) {
        console.error("Error fetching province and city data:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8000/info", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });

        const userInfo = response.data;
        setProvince(userInfo.province_id || "");
        setCity(userInfo.city_id || "");
        setSchool(userInfo.school || "");
        setGrade(userInfo.grade || "");

        if (userInfo.birthday) {
          setBirthday(
            new DateObject({
              date: userInfo.birthday,
              calendar: persian,
              locale: persian_fa,
              format: "YYYY/MM/DD",
            })
          );
        }

        const isComplete =
          userInfo.province_id &&
          userInfo.city_id &&
          userInfo.school &&
          userInfo.grade &&
          userInfo.birthday;

        setIsReadOnly(isComplete);
        setIsEditEnabled(isComplete);
        setIsSubmitDisabled(isComplete);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
      setLoading(false);
    };

    fetchProvinceCityData();
    fetchUserInfo();
  }, [cookies.access_token]);

  if (loading) {
    return (
      <div className="Loader_Container">
          <ScaleLoader color=" #0073e6" height={25}   width={3} />
      </div>
    );
  }

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    if (/^[\u0600-\u06FF\s]+$/.test(value) || value === "") {
      setSchool(value);
      setSchoolError("");
    } else {
      setSchoolError("کیبورد خود را فارسی کنید");
    }
  };

  const handleGradeChange = (e) => {
    const value = e.target.value;
    if (/^[\u0600-\u06FF\s]+$/.test(value) || value === "") {
      setGrade(value);
      setGradeError("");
    } else {
      setGradeError("کیبورد خود را فارسی کنید");
    }
  };

  const handleSubmit = async () => {
    if (province && city && school.trim() && grade.trim() && birthday) {
      setIsLoading(true);
      try {
        const formData = new URLSearchParams();
        formData.append("province", province);
        formData.append("city", city);
        formData.append("school", school);
        formData.append("grade", grade);
        formData.append(
          "birthday",
          birthday.format("YYYY/MM/DD")
        );

        await axios.post("http://localhost:8000/panel", formData, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });

        toast.success("اطلاعات با موفقیت ثبت شد");
        setIsReadOnly(true);
        setIsEditEnabled(true);
        setIsSubmitDisabled(true); 
      } catch (error) {
        toast.error("خطا در ثبت اطلاعات. لطفاً مجدداً تلاش کنید");
      }
      setIsLoading(false);
    } else {
      toast.error("لطفاً تمام فیلدها را پر کنید");
    }
  };

  const handleEdit = () => {
    setIsReadOnly(false);
    setIsEditEnabled(false);
    setIsSubmitDisabled(false); 
  };

  const provinceOptions = provinceCityData.provinces.map((prov) => ({
    value: prov,
    label: prov,
  }));

  const cityOptions = province
    ? provinceCityData.cities[province]?.map((city) => ({
        value: city,
        label: city,
      }))
    : [];

  return (
  <div className="UserDashboard">
    <div className="UserDashboard_container">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="UserDashboard_container_main">
           <h2 className="UserDashboard_container_main_h">پنل کاربری</h2>
           <section className="UserDashboard_container_main_section">
                  <div className="UserDashboard_input_group">
                    <label className="UserDashboard_label">استان:</label>
                    <Select
                      value={provinceOptions.find((opt) => opt.value === province)}
                      className="UserDashboard_label_Select"
                      onChange={(selectedOption) => {
                        setProvince(selectedOption.value);
                        setCity("");
                      }}
                      options={provinceOptions}
                      placeholder="انتخاب کنید"
                      isDisabled={isReadOnly || provinceOptions.length === 0}
                    />
                  </div>

                  <div className="UserDashboard_input_group">
                    <label className="UserDashboard_label">شهرستان:</label>
                    <Select
                      value={cityOptions.find((opt) => opt.value === city)}
                      onChange={(selectedOption) => setCity(selectedOption.value)}
                      options={cityOptions}
                      className="UserDashboard_label_Select"
                      placeholder="انتخاب کنید"
                      isDisabled={isReadOnly || !province}
                    />
                  </div>

                  <div className="UserDashboard_input_group">
                    <label className="UserDashboard_label">نام مدرسه:</label>
                    <input
                      type="text"
                      value={school}
                      onChange={handleSchoolChange}
                      readOnly={isReadOnly}
                      className="UserDashboard_input"
                    />
                    {schoolError && <p className="UserDashboard_error">{schoolError}</p>}
                  </div>

                  <div className="UserDashboard_input_group">
                    <label className="UserDashboard_label">پایه تحصیلی:</label>
                    <input
                      type="text"
                      value={grade}
                      onChange={handleGradeChange}
                      readOnly={isReadOnly}
                      className="UserDashboard_input"
                    />
                    {gradeError && <p className="UserDashboard_error">{gradeError}</p>}
                  </div>

                  <div className="UserDashboard_input_group">
                    <label className="UserDashboard_label">تاریخ تولد:</label>
                    <DatePicker
                      value={birthday}
                      onChange={setBirthday}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      placeholder="تاریخ را انتخاب کنید"
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="UserDashboard_button_group">
                      <button onClick={handleSubmit} disabled={isSubmitDisabled || isLoading} className=" UserDashboard_button_submit">
                            {isLoading ? <BeatLoader color="#fff" /> : "ثبت"}
                      </button>
                      <button onClick={handleEdit} className="UserDashboard_button_edit" disabled={!isEditEnabled}>
                        ویرایش
                      </button>
                  </div>
           </section>
        </div>
    </div>
  </div>

  );
}

export default UserDashboard;





