import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import VerifyRegister from "./components/VerifyRegister.jsx";
import VerifyLogin from "./components/VerifyLogin.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Hesab from "./components/Hesab.jsx";
import Image from "./components/Image.jsx";
import Exam from "./components/Exam.jsx";
import Question from "./components/Question.jsx"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/VerifyRegister" element={<VerifyRegister />} />
        <Route path="/VerifyLogin" element={<VerifyLogin />} />
        <Route path="/Dashboard" element={<Dashboard />}>
          <Route path="Hesab" element={<Hesab />} />
          <Route path="Image" element={<Image />} />
          <Route path="Exam" element={<Exam />} />
          <Route path="Exam/Question" element={<Question />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);





