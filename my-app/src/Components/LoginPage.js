import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../LoginProvider'; 
import './LoginPage.css';
import TableReservationLogo from '../images/TableReservationLogo.png'; 
import { AiOutlineUser } from 'react-icons/ai';
import { FaLock } from 'react-icons/fa';
import { Alert } from 'antd';

function LoginPage() {
  const {
    UserID,
    setUserID,
    userPass,
    setuserPass,
    setIsLoggedIn,
    setUserRole,
  } = useContext(LoginContext);

  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
   
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    try {
      const response = await fetch(`https://localhost:7178/api/Student/api/login?userId=${UserID}&password=${userPass}`, requestOptions);
      if (response.ok) {
        const result = await response.json();
        setUserRole(result.user_role);
        setIsLoggedIn(true);
        if (result.user_role === "Student"){
          navigate("/Home");
        } else {
          navigate("/admin");
        }
         
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Network error, please try again.");
    }
  };
  function checkUserData() {
    if (userPass !== "" && UserID !== "") {
      handleLogin();
    } else {

    }
  }
  return (
    <div className="page-container">
    {showAlert && (
      <Alert
        className="report-alert-warning"
        message="Error"
        description="UserID or password is incorrect!"
        type="error"
        showIcon
        closable
        onClose={() => setShowAlert(false)}
      />
    )}
   
    <div className="container">
      <div className="left">
        <div className="from">
          <h2>Login</h2>

          <label htmlFor="userId" className="userId-lable">
            <AiOutlineUser className="icon" size={24} />
          </label>

          <input
            onChange={(e) => {
              setUserID(e.target.value);
            }}
            type="text"
            className="user-input"
            placeholder="University ID"
          />

          <label htmlFor="userpass" className="userpass-lable">
            <br />
            <FaLock className="icon" size={24} />
          </label>

          <input
            onChange={(e) => {
              setuserPass(e.target.value);
            }}
            type="password"
            className="user-input"
            placeholder="Password"
          />
          <br />
          <a href="">forget password?</a>
          <br />
          <button className="submit-button" onClick={checkUserData}>
            Login
          </button>
        </div>
      </div>

      <div className="right">
        <h1 className="project-title">University Restaurant Table Reservation</h1>
        <img src={TableReservationLogo} alt="Covering Image" />
      </div>
    </div>
  </div>
  );
}

export default LoginPage;
