import React, { useState } from "react";
import { digitsEnToFa } from "@persian-tools/persian-tools";

function Profile() {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const [schoolError, setSchoolError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);


  const provinces = ["استان تهران", "استان اصفهان", "استان خراسان رضوی" , "استان کردستان" , "استان شیراز"];
  const cities = {
    "استان تهران": ["تهران", "کرج", "شهریار"],
    "استان اصفهان": ["اصفهان", "نیستانک", "نجف‌آباد"],
    "استان خراسان رضوی": ["اردبیل", "سبگسس", "سبزوار"  , "سبزقار"],
    "استان کردستان" : ["اردبیل", "سبگسس", "سبزوار"  , "سبزقار"],
    "استان شیراز": ["کردستان", "یتبتنیبت", "یبسیبی"  , "چعهجهعج"],
  };

  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
    setCity("");
    setCitySearch("");
    setIsCityDropdownOpen(false); 
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setIsCityDropdownOpen(false); 
  };

  const validatePersianText = (text) => /^[\u0600-\u06FF\s]+$/.test(text);

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    if (validatePersianText(value) || value === "") {
      setSchool(value);
      setSchoolError("");
    } else {
      setSchoolError("کیبورد خود را فارسی کنید");
    }
  };

  const handleGradeChange = (e) => {
    const value = e.target.value;
    if (validatePersianText(value) || value === "") {
      setGrade(value);
      setGradeError("");
    } else {
      setGradeError("کیبورد خود را فارسی کنید");
    }
  };

  const validateBirthDate = (value) => {
    const regex = /^(\d{4})\/(\d{2})\/(\d{2})$/;
    const match = value.match(regex);

    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);

      if (
        year >= 1300 &&
        year <= 1403 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
      ) {
        setError("");
        return true;
      }
    }
    setError("تاریخ وارد شده معتبر نیست!");
    return false;
  };
   
  const handleBirthDateChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9]/g, "");

    if (value.length > 4 && value.length <= 6) {
      value = value.slice(0, 4) + "/" + value.slice(4);
    } else if (value.length > 6) {
      value =
        value.slice(0, 4) +
        "/" +
        value.slice(4, 6) +
        "/" +
        value.slice(6, 8);
    }

    if (value.length > 10) {
      return;
    }

    setBirthDate(value);

    if (value.length === 10) {
      validateBirthDate(value);
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!birthDate) {
      alert("لطفاً تمام فیلدها را پر کنید");
      return;
    }
  
    if (!validateBirthDate(birthDate)) {
      return; 
    }
  
    if (
      province &&
      city &&
      school.trim() &&
      grade.trim() &&
      validatePersianText(school) &&
      validatePersianText(grade)
    ) {
      setIsReadOnly(true);
      setIsEditEnabled(true);
    } else {
      alert("لطفاً تمام فیلدها را پر کنید");
    }
  };

  
  

  const handleEdit = () => {
    setIsReadOnly(false);
    setIsEditEnabled(false);
  };

  return (
    <div className="Profile_container">
      <h2 className="Profile_heading">ویرایش پروفایل</h2>

      <div className="Profile_input_group">
        <label htmlFor="province" className="Profile_label">
          استان:
        </label>
        <select
          id="province"
          value={province}
          onChange={handleProvinceChange}
          className="Profile_input"
        >
          <option value="">انتخاب کنید</option>
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      <div className="Profile_input_group">
        <label htmlFor="city" className="Profile_label">
          شهرستان:
        </label>
        <div
          className={`Profile_custom_select ${
            !province ? "disabled" : ""
          }`} 
          onClick={() => province && setIsCityDropdownOpen(!isCityDropdownOpen)}
        >
          <div className="Profile_selected_value">
            {city || "انتخاب کنید"}
          </div>
          {isCityDropdownOpen && (
            <div className="Profile_dropdown_menu">
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="جستجوی شهرستان"
                className="Profile_search_input"
                autoFocus
              />
              <div className="Profile_options">
                {cities[province]
                  .filter((ct) =>
                    ct.toLowerCase().includes(citySearch.toLowerCase())
                  )
                  .map((filteredCity) => (
                    <div
                      key={filteredCity}
                      className="Profile_option"
                      onClick={() => handleCitySelect(filteredCity)}
                    >
                      {filteredCity}
                    </div>
                  ))}
                {cities[province].filter((ct) =>
                  ct.toLowerCase().includes(citySearch.toLowerCase())
                ).length === 0 && (
                  <div className="Profile_no_option">شهرستانی یافت نشد</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="Profile_input_group">
        <label htmlFor="school" className="Profile_label">
          نام مدرسه:
        </label>
        <input
          type="text"
          id="school"
          value={school}
          onChange={handleSchoolChange}
          readOnly={isReadOnly}
          className="Profile_input"
        />
        {schoolError && <p className="Profile_error">{schoolError}</p>}
      </div>

      <div className="Profile_input_group">
        <label htmlFor="grade" className="Profile_label">
          پایه تحصیلی:
        </label>
        <input
          type="text"
          id="grade"
          value={grade}
          onChange={handleGradeChange}
          readOnly={isReadOnly}
          className="Profile_input"
        />
        {gradeError && <p className="Profile_error">{gradeError}</p>}
      </div>

      <div className="Profile_input_group">
        <label htmlFor="birthDate" className="Profile_label">
          تاریخ تولد:
        </label>
        <input
          type="text"
          id="birthDate"
          value={digitsEnToFa(birthDate)}
          onChange={(e) => {
            const englishDigits = e.target.value.replace(/[۰-۹]/g, (d) =>
              String.fromCharCode(d.charCodeAt(0) - 1728)
            );
            handleBirthDateChange({ target: { value: englishDigits } });
          }}
          readOnly={isReadOnly}
          className="Profile_input"
          placeholder="YYYY/MM/DD"
        />
        {error && <p className="Profile_error">{digitsEnToFa(error)}</p>}
      </div>

      <div className="Profile_button_group">
        <button onClick={handleSubmit} className="Profile_button submit">
          ثبت
        </button>

        <button
          onClick={handleEdit}
          className={`Profile_button edit ${isEditEnabled ? "enabled" : ""}`}
          disabled={!isEditEnabled}
        >
          ویرایش
        </button>
      </div>
    </div>
  );
}

export default Profile;




