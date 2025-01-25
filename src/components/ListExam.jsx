import React from "react";
import { useCookies } from "react-cookie";
import AdminListExam from "./AdminListExam";
import EditorListExam from "./EditorListExam";

function ListExam () {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="ListExam_container">
      {cookies.role === "admin" && <AdminListExam />}
      {cookies.role === "editor" && <EditorListExam />}
    </div>
  );
}

export default ListExam ;