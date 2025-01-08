import React from "react";
import { useCookies } from "react-cookie";


function Hesab() {
  const [cookies] = useCookies(["firstName" , "lastName" , "phoneNumber" ]);

  const firstName = cookies.firstName;
  const lastName = cookies.lastName;
  const phoneNumber = cookies.phoneNumber;

  return (
    <div className="Hesab_container">
      <h1 className="Hesab_header">صفحه اطلاعات حساب</h1>
      <div className="Hesab_details">
        <div className="Hesab_field">
          <label>نام:</label>
          <input type="text" value={firstName } readOnly />
        </div>
        <div className="Hesab_field">
          <label>نام خانوادگی:</label>
          <input type="text" value={lastName } readOnly />
        </div>
        <div className="Hesab_field">
          <label>شماره موبایل:</label>
          <input type="text" value={phoneNumber} readOnly />
        </div>
      </div>
    </div>
  );
}

export default Hesab;


