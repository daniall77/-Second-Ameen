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
import Account from "./components/Account.jsx";
import Image from "./components/Image.jsx";
import Exam from "./components/Exam.jsx";
import Question from "./components/Question.jsx"; 
import Content from "./components/Content.jsx"; 
import ListExam from "./components/ListExam.jsx"; 
import Correcting from "./components/Correcting.jsx"; 
import ViewContent from "./components/ViewContent.jsx"; 
import ListMatches from "./components/ListMatches.jsx" ;
import ConfirmContent from "./components/ConfirmContent.jsx"; 
import Matche from "./components/Matche.jsx"; 
import ListPhone from "./components/ListPhone.jsx";
import EditContent from "./components/EditContent.jsx";



createRoot(document.getElementById("root")).render(
//   <StrictMode>
      <Router>
          <Routes>
              <Route path="/" element={<App />} />
              <Route path="/ListMatches" element={<ListMatches />} />
              <Route path="/ListMatches/Matche" element={<Matche />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/VerifyRegister" element={<VerifyRegister />} />
              <Route path="/VerifyLogin" element={<VerifyLogin />} />
              <Route path="/Dashboard" element={<Dashboard />}>
                  <Route path="Account" element={<Account />} />
                  <Route path="Image" element={<Image />} />
                  <Route path="Exam" element={<Exam />} />
                  <Route path="Content" element={<Content />} />
                  <Route path="ListExam" element={<ListExam />} />
                  <Route path="ListExam/ListPhone" element={<ListPhone />} />
                  <Route path="ListExam/ListPhone/Correcting" element={<Correcting />} />
                  <Route path="Exam/Question" element={<Question />} />
                  <Route path="ViewContent" element={<ViewContent />} />
                  <Route path="ConfirmContent" element={<ConfirmContent />} />
                  <Route path="EditContent" element={<EditContent />} />
              </Route>
          </Routes>
      </Router>
   /* </StrictMode>  */
);





