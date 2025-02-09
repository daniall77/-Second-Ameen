import React from "react";
import { useCookies } from "react-cookie";
import AdminListPhone from "./AdminListPhone";
import EditorListPhone from "./EditorListPhone";

function ListPhone () {
  const [cookies] = useCookies(["role"]);

  return (
    <div className="ListPhone_container">
      {cookies.role === "admin" && <AdminListPhone />}
      {cookies.role === "editor" && <EditorListPhone />}
    </div>
  );
}

export default ListPhone ;




