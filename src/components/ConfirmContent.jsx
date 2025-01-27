import React from "react";
import { useCookies } from "react-cookie";
import AdminConfirmContent from "./AdminConfirmContent";
import EditorConfirmContent from "./EditorConfirmContent";

function ConfirmContent () {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="ConfirmContent_container">
      {cookies.role === "admin" && <AdminConfirmContent />}
      {cookies.role === "editor" && <EditorConfirmContent />}
    </div>
  );
}

export default ConfirmContent ;