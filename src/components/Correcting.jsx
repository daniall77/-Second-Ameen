import React from "react";
import { useCookies } from "react-cookie";
import AdminCorrecting from "./AdminCorrecting";
import EditorCorrecting from "./EditorCorrecting";

function Correcting () {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="Correcting_container">
      {cookies.role === "admin" && <AdminCorrecting />}
      {cookies.role === "editor" && <EditorCorrecting />}
    </div>
  );
}

export default Correcting ;