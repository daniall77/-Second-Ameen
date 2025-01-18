import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function EditorDashboard() {
  const [users, setUsers] = useState([]); 
  const [editors, setEditors] = useState([]);

 
  useEffect(() => {
    const fetchUsersAndEditors = async () => {
      try {
        
        const usersResponse = await axios.get("http://localhost:8000/users");
        setUsers(usersResponse.data);

       
        const editorsResponse = await axios.get("http://localhost:8000/editors");
        setEditors(editorsResponse.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("خطا در دریافت کاربران یا ادیتورها!");
      }
    };

    fetchUsersAndEditors();
  }, []);

  return (
    <div className="EditorDashboard_container">
      <Toaster className="Verify_Toaster" position="top-right" reverseOrder={false} />

      <h2>لیست کاربران</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.first_name} {user.last_name} ({user.phone_number})
            </li>
          ))
        ) : (
          <p>هیچ کاربری یافت نشد</p>
        )}
      </ul>

      <h2>لیست ادیتورها</h2>
      <ul>
        {editors.length > 0 ? (
          editors.map((editor) => (
            <li key={editor.id}>
              {editor.first_name} {editor.last_name} ({editor.phone_number})
            </li>
          ))
        ) : (
          <p>هیچ ادیتوری یافت نشد</p>
        )}
      </ul>
    </div>
  );
}

export default EditorDashboard;
