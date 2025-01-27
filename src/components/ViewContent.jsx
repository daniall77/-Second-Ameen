import React from "react";
import { useCookies } from "react-cookie";
import AdminViewContent from "./AdminViewContent";
import UserViewContent from "./UserViewContent";
import EditorViewContent from "./EditorViewContent";

function ViewContent () {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="ViewContent_container">
      {cookies.role === "admin" && <AdminViewContent />}
      {cookies.role === "user" && <UserViewContent />}
      {cookies.role === "editor" && <EditorViewContent />}
    </div>
  );
}

export default ViewContent ;