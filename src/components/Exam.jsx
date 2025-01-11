import React from "react";
import { useCookies } from "react-cookie";
import UserExam from "./UserExam";
import AdminExam from "./AdminExam";
import EditorExam from "./EditorExam";

function Exam() {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="Exam_container">
      {cookies.role === "admin" && <AdminExam />}
      {cookies.role === "user" && <UserExam />}
      {cookies.role === "editor" && <EditorExam />}
    </div>
  );
}

export default Exam;





