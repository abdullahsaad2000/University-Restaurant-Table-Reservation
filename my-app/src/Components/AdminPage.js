import React, { useEffect, useState } from "react";
import { Alert } from 'antd';
import NavigationBar from "./NavigationBar";
import "./AdminPage.css";

function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [showNoReservations, setShowNoReservations] = useState(false);
  const [tables, setTables] = useState({});
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("https://localhost:7178/api/Student/GetPendingReservations");
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
          fetchTables(data);
        } else {
          setShowNoReservations(true);
          console.log("hhhhihi")
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setShowNoReservations(true);
      }
    };
    fetchReservations();

  
  }, []);

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

 
  

  const updateReservationStatus = async (reservationId) => {
    if (!reservationId) {
      alert("Reservation ID is undefined.");
      console.error("Reservation ID is undefined.");
      return;
    }
  
    const url = `https://localhost:7178/api/Student/UpdateReservationStatus/${reservationId}`;
    try {
      const response = await fetch(url, { method: 'PUT' });
      if (response.ok) {
        setShowSuccessAlert(true);
      } else {
        setShowWarningAlert(true);
        const errorText = await response.text();
        alert(`Failed to update reservation status: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
      alert("Error updating reservation status.");
    }
  };

  return (
    <div className="admin-my-page">
      {showWarningAlert && (
        <Alert
          className="update-warning"
          message="Error Happend!"
          description="Please try again"
          type="error"
          showIcon
          closable
          onClose={() => setShowWarningAlert(false)}
        />
      )}
      {showSuccessAlert && (
        <Alert
          className="update-success"
          message="Reservation updated Successfully!!!"
          type="success"
          showIcon
          closable
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
      <NavigationBar />
      <div className="admin-reservation">
        {showNoReservations ? (
          <p>No reservations found.</p>
        ) : (
          reservations.map(reservation => (
            <div key={reservation.reservation_Id} className="admin-reservation-card">
              <div>Reservation ID: {reservation.reservation_Id}</div>
              <div>Status: {reservation.reservation_status}</div>
              <div>Reserved By: {reservation.reservedByFirstName} {reservation.reservedByLastName}</div>
              <div>Table Number: {tables[reservation.table_Id]?.table_number || 'Loading...'}</div>
              <div>Number of Chairs: {tables[reservation.table_Id]?.num_chairs || 'Loading...'}</div>
              <div>
                <button 
                  className="admin-button-cancel"
                  onClick={() => updateReservationStatus(reservation.reservation_Id)}
                >
                  Confirm
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPage;
