import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie"; 
import toast, { Toaster } from "react-hot-toast";
import { ScaleLoader, BeatLoader } from "react-spinners";
import Select from "react-select";

function AdminDashboard() {

  const [cookies] = useCookies(["access_token"]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changingUserId, setChangingUserId] = useState(null);

  const [adminPage, setAdminPage] = useState(1);
  const [adminRowsPerPage, setAdminRowsPerPage] = useState(2);

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


  const changeUserRole = async (userId, newRole) => {
    setChangingUserId(userId);
    try {
      let endpoint = "";
      if (newRole === "admin") {
        endpoint = "http://localhost:8000/convert/admins";
      } else if (newRole === "editor") {
        endpoint = "http://localhost:8000/convert/editors";
      } else if (newRole === "user") {
        endpoint = "http://localhost:8000/convert/users";
      }
  
      await axios.put(endpoint, null, {
        params: { user_id: userId },
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
  
      setData((prevData) => {
       
        const user =
          prevData.admins.find((u) => u.id === userId) ||
          prevData.editors.find((u) => u.id === userId) ||
          prevData.users.find((u) => u.id === userId);
  
        if (!user) return prevData;
  
     
        const updatedAdmins = prevData.admins.filter((u) => u.id !== userId);
        const updatedEditors = prevData.editors.filter((u) => u.id !== userId);
        const updatedUsers = prevData.users.filter((u) => u.id !== userId);
  
        
        if (newRole === "admin") {
          return {
            ...prevData,
            admins: [...updatedAdmins, user],
            editors: updatedEditors,
            users: updatedUsers,
          };
        } else if (newRole === "editor") {
          return {
            ...prevData,
            admins: updatedAdmins,
            editors: [...updatedEditors, user],
            users: updatedUsers,
          };
        } else {
          return {
            ...prevData,
            admins: updatedAdmins,
            editors: updatedEditors,
            users: [...updatedUsers, user],
          };
        }
      });
  
      toast.success("تغییر نقش با موفقیت انجام شد");
      
    } catch (err) {
      toast.error("تغییر نقش انجام نشد");
    }
    setChangingUserId(null);
  };
  

  if (loading) {
    return (
      <div className="Loader_Container">
          <ScaleLoader color=" #0073e6" height={25}   width={3} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
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


  const options = [
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
  ];

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
            <div className="pagination_one">
            <button
              className="pagination_button_one"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              اول
            </button>
            <button
              className="pagination_button_two"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              قبلی
            </button>
            {renderPageNumbers(totalItems, currentPage, rowsPerPage, onPageChange)}
            <button
              className="pagination_button_two"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              بعدی
            </button>
            <button
              className="pagination_button_one"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              آخر
            </button>
            </div>
            <div className="pagination_two" >
              <Select
                  className="pagination_two_select"
                  value={options.find((option) => option.value === rowsPerPage)}
                  onChange={(selectedOption) => {
                    onRowsChange(selectedOption.value);
                    onPageChange(1);
                  }}
                  options={options}
              />
            </div>
          </div>
    );
  };

  return (
    <div className="AdminDashboard" dir="rtl">
      <div className="AdminDashboard_container">
        <Toaster position="top-center" reverseOrder={false} />

        <div className="AdminDashboard_container_main">
              <h1 className="AdminDashboard_container_main_h" >پنل کاربری</h1>
            
              <section className="AdminDashboard_container_main_section"> 
                <h2 className="AdminDashboard_container_main_section_h"> لیست ادمین ها</h2>
                {data.admins.length > 0 ? (
                  <>
                    <table className="AdminDashboard_container_table" >
                      <thead className="AdminDashboard_container_thead">
                        <tr  className="AdminDashboard_container_thead_tr">
                          <th>شماره</th>
                          <th>نام</th>
                          <th>شماره موبایل</th>
                          <th>نام خانوادگی</th>
                        </tr>
                      </thead>
                      <tbody className="AdminDashboard_container_tbody">
                            {paginate(data.admins , adminPage , adminRowsPerPage).map((admin, index) => (
                              <tr  key={index} className="AdminDashboard_container_tbody_tr">
                                <td>{(adminPage - 1) * adminRowsPerPage + index + 1}</td> 
                                <td>{admin.first_name}</td>
                                <td>{admin.phone_number}</td>
                                <td>{admin.last_name}</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                    {renderPaginationControls(
                      data.admins.length,
                      adminPage,
                      adminRowsPerPage,
                      setAdminPage,
                      setAdminRowsPerPage
                    )}
                  </>
                ) : (
                  <p className="AdminDashboard_container_p">هیچ ادمینی وجود ندارد</p>
                )}
              </section>

              <section className="AdminDashboard_container_main_section">
                <h2 className="AdminDashboard_container_main_section_h">لیست ادیتور ها</h2>
                {data.editors.length > 0 ? (
                  <>
                    <table  className="AdminDashboard_container_table" >
                      <thead className="AdminDashboard_container_thead">
                        <tr className="AdminDashboard_container_thead_tr">
                          <th>شماره</th>
                          <th>نام</th>
                          <th>شماره موبایل</th>
                          <th>نام خانوادگی</th>
                          <th>تغییر نقش</th>
                        </tr>
                      </thead>
                      <tbody className="AdminDashboard_container_tbody">
                        {paginate(data.editors, editorPage, editorRowsPerPage).map((editor, index) => (
                          <tr key={index} className="AdminDashboard_container_tbody_tr">
                            <td>{(editorPage - 1) * editorRowsPerPage + index + 1}</td> 
                            <td>{editor.first_name}</td>
                            <td>{editor.phone_number}</td>
                            <td>{editor.last_name}</td>
                            <td>
                                <div className="AdminDashboard_container_button">
                                      <button 
                                        className="AdminDashboard_button" 
                                        onClick={() => changeUserRole(editor.id, "admin")} 
                                        disabled={changingUserId === editor.id}
                                      >
                                        {changingUserId === editor.id ? <BeatLoader color="#fff"  /> : "ادمین"}
                                      </button>
                                </div>
                                <div className="AdminDashboard_container_button">
                                        <button 
                                          className="AdminDashboard_button1" 
                                          onClick={() => changeUserRole(editor.id, "user")} 
                                          disabled={changingUserId === editor.id}
                                        >
                                          {changingUserId === editor.id ? <BeatLoader color="#fff"  /> : "کاربر"}
                                        </button>
                                </div>
                            </td>
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
                  <p className="AdminDashboard_container_p">هیچ ادیتوری وجود ندارد</p>
                )}
              </section>

              <section className="AdminDashboard_container_main_section">
                <h2 className="AdminDashboard_container_main_section_h">لیست کاربر ها</h2>
                {data.users.length > 0 ? (
                  <>
                    <table  className="AdminDashboard_container_table">
                      <thead className="AdminDashboard_container_thead">
                        <tr className="AdminDashboard_container_thead_tr">
                          <th>شماره</th>
                          <th>نام</th>
                          <th>شماره موبایل</th>
                          <th>نام خانوادگی</th>
                          <th className="AdminDashboard_none">استان</th>
                          <th className="AdminDashboard_none">شهر</th>
                          <th className="AdminDashboard_none">تاریخ تولد</th>
                          <th className="AdminDashboard_none">نام مدرسه</th>
                          <th className="AdminDashboard_none">پایه تحصیلی</th>
                          <th>تغییر نقش</th>
                        </tr>
                      </thead>
                      <tbody className="AdminDashboard_container_tbody">
                        {paginate(data.users, userPage, userRowsPerPage).map((user, index) => (
                          <tr key={index} className="AdminDashboard_container_tbody_tr">
                            <td>{(userPage - 1) * userRowsPerPage + index + 1}</td> 
                            <td>{user.first_name}</td>
                            <td>{user.phone_number}</td>
                            <td>{user.last_name}</td>
                            <td className="AdminDashboard_none">{user.province_id}</td>
                            <td className="AdminDashboard_none">{user.city_id}</td>
                            <td className="AdminDashboard_none">{user.birthday}</td>
                            <td className="AdminDashboard_none">{user.school}</td>
                            <td className="AdminDashboard_none">{user.grade}</td>
                            <td>
                                  <div className="AdminDashboard_container_button">
                                        <button className="AdminDashboard_button" onClick={() => changeUserRole(user.id, "admin")} disabled={changingUserId === user.id}>
                                              {changingUserId === user.id ? <BeatLoader color="#fff"  /> : "ادمین"}
                                        </button>
                                  </div>
                                  <div className="AdminDashboard_container_button">
                                        <button className="AdminDashboard_button" onClick={() => changeUserRole(user.id, "editor")} disabled={changingUserId === user.id}>
                                            {changingUserId === user.id ? <BeatLoader color="#fff"  /> : "ادیتور"}
                                        </button>
                                  </div>
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
                  <p className="AdminDashboard_container_p">هیچ کاربری وجود ندارد</p>
                )}
              </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;



