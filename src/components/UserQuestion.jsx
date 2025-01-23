import React from "react";
import { useLocation } from "react-router-dom";

function UserQuestion () {
  const location = useLocation();
  const { questions } = location.state || {}; 

  if (!questions) {
    return <p>هیچ سوالی یافت نشد. لطفاً دوباره تلاش کنید</p>;
  }

  return (
    <div className="UserQuestion_container">

    </div>
  );
}

export default UserQuestion;
