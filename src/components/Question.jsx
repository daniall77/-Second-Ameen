import React from "react";
import { useCookies } from "react-cookie";
import UserQuestion from "./UserQuestion";
import AdminQuestion from "./AdminQuestion";
import EditorQuestion from "./EditorQuestion";

function Question() {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="Question_container">
      {cookies.role === "admin" && <AdminQuestion />}
      {cookies.role === "user" && <UserQuestion />}
      {cookies.role === "editor" && <EditorQuestion />}
    </div>
  );
}

export default Question;
