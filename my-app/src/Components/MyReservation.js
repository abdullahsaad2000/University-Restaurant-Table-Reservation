import React, { useEffect, useState, useContext } from "react";
import { LoginContext } from '../LoginProvider';  
import "./MyReservation.css";
import NavigationBar from "./NavigationBar";
import { Alert } from 'antd';

function MyReservation() {
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
  const [reservations, setReservations] = useState([]);
  const [showNoReservations, setShowNoReservations] = useState(false);
  const [tables, setTables] = useState({});
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`https://localhost:7178/api/Student/GetMyReservations/${UserID}`);
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
          fetchTables(data);
        } else {
          setShowNoReservations(true);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setShowNoReservations(true);
      }
    };
    fetchReservations();

   
     const intervalUnconfirmed = setInterval(() => {
      cleanupReservations('CleanupUnconfirmedReservations');
    }, 60000); // every 5 minutes

    const intervalConfirmed = setInterval(() => {
      cleanupReservations('CleanupConfirmedReservations');
    }, 60000); // every 30 minutes

    return () => {
      clearInterval(intervalUnconfirmed);
      clearInterval(intervalConfirmed);
    };
  }, [UserID]);

  const fetchTables = async (reservations) => {
    const tablesData = {};
    for (const reservation of reservations) {
      const response = await fetch(`https://localhost:7178/api/Student/GetTableById/${reservation.table_Id}`);
      if (response.ok) {
        const table = await response.json();
        tablesData[reservation.table_Id] = table;
      }
    }
    setTables(tablesData);
  };
  
 
  const cleanupReservations = async (endpoint) => {
    try {
      const response = await fetch(`https://localhost:7178/api/Student/${endpoint}`, {
        method: 'DELETE',
     
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert("reservations cleaned successfully"); 
   
    } catch (error) {
      console.error(`Error during ${endpoint}:`, error);
    }
  };
  return (
    
    <div className="my-page">
      <NavigationBar />
    <div className="my-reservation">
      {showNoReservations ? (
        <p>No reservations found.</p>
      ) : (
        reservations.map(reservation => (
          <div key={reservation.reservation_Id} className="reservation-card">
            <div>Reservation ID: {reservation.reservation_Id}</div>
            <div>Status: {reservation.reservation_status}</div>
            <div>Reserved By: {reservation.reservedByFirstName} {reservation.reservedByLastName}</div>
            <div>Table Number: {tables[reservation.table_Id]?.table_number || 'Loading...'}</div>
            <div>Number of Chairs: {tables[reservation.table_Id]?.num_chairs || 'Loading...'}</div>
          
          </div>
        ))
      )}
    </div>
    </div>
  );
}

export default MyReservation;
