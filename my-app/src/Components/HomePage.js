import React, { useEffect, useState, useContext } from 'react';
import { LoginContext } from '../LoginProvider';  
import TableCard from './TableCard';
import NavigationBar from "./NavigationBar";
import "./HomePage.css";
import { Alert } from 'antd';


function HomePage() {
  const [tables, setTables] = useState([]);
  const [showNoTables, setShowNoTables] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { UserID } = useContext(LoginContext);  


  const getTables = async () => {
    try {
      const response = await fetch("https://localhost:7178/api/Student/GetTables", { method: 'GET', redirect: 'follow' });
      if (response.ok) {
        const result = await response.json();

        setTables(result);
      } else {
        console.log("No tables found!");
        setShowNoTables(true);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      setShowNoTables(true);
    }
  };

  const addReservation = async (tableId) => {
    try {
      const url = `https://localhost:7178/api/Student/AddReservation?reservedBy=${UserID}&tableId=${tableId}`;
      const response = await fetch(url, { method: 'POST' });
      if (response.ok) {
        setShowSuccessAlert(true);
        getTables(); 
      } else {
        setShowWarningAlert(true);
      }
    } catch (error) {
      console.error('Error adding reservation:', error);
      setShowWarningAlert(true);
    }
  };

  useEffect(() => {
    getTables();
  }, []);

  return (
    <div className="map-table">
      <NavigationBar />
      {showNoTables && <p>No tables available.</p>}
      {showWarningAlert && 
       <Alert
       className="reserved-table-warning"
       message="This is table is already reserved!!!"
       description="Please try to another table"
       type="error"
       showIcon
       closable
       onClose={() =>  setShowWarningAlert(false)}
     />
      }
      {showSuccessAlert &&
        <Alert
          className="reserved-table-success"
          message="Table Reserved Successfully!!!"
          description="Please confirm your reservation within 5 Mintues"
          type="success"
          showIcon
          closable
          onClose={() => setShowSuccessAlert(false)}
        />
      }
      {tables.map(table => (
        <TableCard
          key={table.table_Id}
          tableNumber={table.table_number}
          numberOfChairs={table.num_chairs}
          reserved={table.reserved}
          onClick={() => addReservation(table.table_Id)}
        />
      ))}
    </div>
  );
}

export default HomePage;
