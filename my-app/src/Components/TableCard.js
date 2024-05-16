import React, { useContext, useState } from "react";
import "./Tables.css";

import { GiRoundTable } from "react-icons/gi";


function TableCard({ tableNumber, numberOfChairs, reserved, onClick }) {
 
  return (
    <div className={`table-card ${reserved === 'yes' ? 'reserved' : 'available'}`} onClick={onClick}>
        <GiRoundTable className="table-icon" /> 
        <p className="table-entry">Table Number: {tableNumber}</p>
      <p className="table-entry">Number of Chairs: {numberOfChairs}</p>

    </div>
  )
}

export default TableCard;