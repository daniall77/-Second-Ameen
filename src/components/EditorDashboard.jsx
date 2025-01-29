import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";

function EditorDashboard() {

  const [cookies] = useCookies(["access_token"]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editorPage, setEditorPage] = useState(1);
  const [editorRowsPerPage, setEditorRowsPerPage] = useState(2);

  const [userPage, setUserPage] = useState(1);
  const [userRowsPerPage, setUserRowsPerPage] = useState(2);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users");
        setData(response.data);
        console.log("Fetched Users Data:", response.data);
      } catch (err) {
        console.error("Error fetching users:", err.message || err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const convertToEditor = async (userId) => {
    try {
      await axios.put(
        "http://localhost:8000/convert/editors",
        null,
        {
          params: { user_id: userId },
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
  
      setData((prevData) => {
        const updatedUser = prevData.users.find((user) => user.id === userId);
        if (!updatedUser) return prevData;
  
        return {
          ...prevData,
          users: prevData.users.filter((user) => user.id !== userId),
          editors: [...prevData.editors, { ...updatedUser, role: "editor" }],
        };
      });
  
      toast.success("کاربر با موفقیت به ویرایشگر تبدیل شد!");
    } catch (err) {
      toast.error("عملیات ناموفق بود.");
    }
  };




  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const paginate = (data, page, rowsPerPage) => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const renderPageNumbers = (totalItems, currentPage, rowsPerPage, onPageChange) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage + 2 >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${currentPage === i ? "active" : ""} page-button`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const renderPaginationControls = (
    totalItems,
    currentPage,
    rowsPerPage,
    onPageChange,
    onRowsChange
  ) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          اول
        </button>
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          قبلی
        </button>
        {renderPageNumbers(totalItems, currentPage, rowsPerPage, onPageChange)}
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          بعدی
        </button>
        <button
          className="pagination-button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          آخر
        </button>
        <div>
          <span>تعداد ردیف‌ها در هر صفحه: </span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              onRowsChange(parseInt(e.target.value));
              onPageChange(1); 
            }}
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
        
      <h1>لیست کاربران</h1>

      <section>
        <h2>ویرایشگران</h2>
        {data.editors.length > 0 ? (
          <>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>نام</th>
                  <th>شماره موبایل</th>
                  <th>نام خانوادگی</th>
                </tr>
              </thead>
              <tbody>
                {paginate(data.editors, editorPage, editorRowsPerPage).map((editor, index) => (
                  <tr key={index}>
                    <td>{(editorPage - 1) * editorRowsPerPage + index + 1}</td> 
                    <td>{editor.first_name}</td>
                    <td>{editor.phone_number}</td>
                    <td>{editor.last_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPaginationControls(
              data.editors.length,
              editorPage,
              editorRowsPerPage,
              setEditorPage,
              setEditorRowsPerPage
            )}
          </>
        ) : (
          <p>هیچ ویرایشگری وجود ندارد</p>
        )}
      </section>

      <section>
        <h2>کاربران</h2>
        {data.users.length > 0 ? (
          <>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>نام</th>
                  <th>شماره موبایل</th>
                  <th>نام خانوادگی</th>
                  <th>استان</th>
                  <th>شهر</th>
                  <th>تاریخ تولد</th>
                  <th>نام مدرسه</th>
                  <th>پایه تحصیلی</th>
                  <th>تغییر نقش</th>
                </tr>
              </thead>
              <tbody>
                {paginate(data.users, userPage, userRowsPerPage).map((user, index) => (
                  <tr key={index}>
                    <td>{(userPage - 1) * userRowsPerPage + index + 1}</td> 
                    <td>{user.first_name}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.last_name}</td>
                    <td>{user.province_id}</td>
                    <td>{user.city_id}</td>
                    <td>{user.birthday}</td>
                    <td>{user.school}</td>
                    <td>{user.grade}</td>
                    <td>
                          <button onClick={() => convertToEditor(user.id)}>تبدیل به ویرایشگر</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPaginationControls(
              data.users.length,
              userPage,
              userRowsPerPage,
              setUserPage,
              setUserRowsPerPage
            )}
          </>
        ) : (
          <p>هیچ کاربری وجود ندارد</p>
        )}
      </section>
    </div>
  );
}

export default EditorDashboard;
