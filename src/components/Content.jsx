import React from "react";
import { useCookies } from "react-cookie";
import AdminContent from "./AdminContent";
import UserContent from "./UserContent";
import EditorContent from "./EditorContent";

function Content() {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="Content_container">
      {cookies.role === "admin" && <AdminContent />}
      {cookies.role === "user" && <UserContent />}
      {cookies.role === "editor" && <EditorContent />}
    </div>
  );
}

export default Content;







