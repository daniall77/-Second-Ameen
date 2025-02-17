import React from "react";
import { useCookies } from "react-cookie";


function Account() {
  const [cookies] = useCookies(["firstName" , "lastName" , "phoneNumber" ]);

  const firstName = cookies.firstName;
  const lastName = cookies.lastName;
  const phoneNumber = cookies.phoneNumber;

  return (
    <div className="Account" dir="rtl">
        <div className="Account_container" >
          <h1 className="Account_header">صفحه اطلاعات حساب</h1>
          <fieldset className="Account_details">
            <legend className="Account_legend">جزئیات حساب</legend>
            <label htmlFor="firstName" className="Account_label" >نام:</label>
            <input id="firstName" className="Account_input" type="text" value={firstName} readOnly />

            <label htmlFor="lastName" className="Account_label" >نام خانوادگی:</label>
            <input id="lastName" type="text" className="Account_input" value={lastName} readOnly />

            <label htmlFor="phoneNumber" className="Account_label" >شماره موبایل:</label>
            <input id="phoneNumber" className="Account_input" type="text" value={phoneNumber} readOnly />
          </fieldset>
        </div>
    </div>
  );
}



export default Account;



