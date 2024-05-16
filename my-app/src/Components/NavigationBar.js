import React from "react";
import "./NavigationBar.css";
import { LoginContext } from '../LoginProvider';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

function NavigationBar() {
  const { 
    UserID,
    setUserID,
    userPass,
    setuserPass,
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole 
  } = useContext(LoginContext); 
  const navigate = useNavigate();

  function handelLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userID");
    localStorage.removeItem("userRole");
    setUserID("");
    setuserPass("");
    setUserRole("");
    setIsLoggedIn(false);

    navigate("/");
  }

  return (
    <div className="bar">
      {userRole !== "Admin" ? (
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/myreservation">My Reservation</Link>
          </li>
          <li>
            <button className="logout-button" onClick={handelLogout}>Logout</button>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <button className="logout-button" onClick={handelLogout}>Logout</button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default NavigationBar;
