import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

function AdminDashboard() {
  

  const [topics, setTopics] = useState([]); 
  const [newTopic, setNewTopic] = useState(""); 
  const [cookies] = useCookies(["access_token"]);

 

 
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://localhost:8000/categories");
        console.log(response.data);
        setTopics(response.data.categories); 
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast.error("خطا در دریافت موضوعات!");
      }
    };

    fetchTopics();
  }, [cookies.access_token]);


  const handleAddTopic = async () => {
    if (newTopic.trim() === "") {
      toast.error("لطفاً یک موضوع وارد کنید!");
      return;
    }

    if (topics.some((topic) => topic.name === newTopic.trim())) {
      toast.error("این موضوع قبلاً اضافه شده است!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/categories/create",
        { name: newTopic.trim() },
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      console.log(response.data);
      setTopics([...topics, response.data]);
      setNewTopic("");
      toast.success("موضوع با موفقیت اضافه شد!");
    } catch (error) {
      console.error("Error adding topic:", error.response || error.message);
      toast.error("خطا در اضافه کردن موضوع!");
    }
  };

 
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTopic();
    }
  };

  return (
    <div className="AdminDashboard_container">

      <Toaster className="Verify_Toaster" position="top-right" reverseOrder={false} />

      <h2 className="dashboard-title">مدیریت موضوعات</h2>

      <div className="topic-input">
        <input
          type="text"
          placeholder="یک موضوع جدید اضافه کنید..."
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-box"
        />
        <button onClick={handleAddTopic} className="add-button">
          + افزودن
        </button>
      </div>

      <h3>لیست موضوعات:</h3>
      <ul>
        {topics.length > 0 ? (
          topics.map((topic) => <li key={topic.id}>{topic.name}</li>)
        ) : (
          <p>هیچ موضوعی یافت نشد</p>
        )}
      </ul>

    </div>
  );
}

export default AdminDashboard;

