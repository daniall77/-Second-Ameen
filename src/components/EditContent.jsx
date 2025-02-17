import React from "react";
import { useCookies } from "react-cookie";
import AdminEditContent from "./AdminEditContent";
import EditorEditContent from "./EditorEditContent";

function EditContent () {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="ViewContent_container">
      {cookies.role === "admin" && <AdminEditContent />}
      {cookies.role === "editor" && <EditorEditContent />}
    </div>
  );
}

export default EditContent ;

