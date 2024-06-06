// Sidebar.js
import React from 'react';

const Sidebar = ({ activeItem, handleItemClick }) => {
  return (
    <div className="sidebar h-screen sticky top-0">
      <div className="sidebar-content shadow-2xl">
        <div>
          <div className="image">
            <img
              src="/images/logo1.png"
              alt="logo.png"
              className="logo-img"
            />
          </div>
        </div>
        <div>
          <ul>
            <li className={activeItem === "home" ? "active" : ""} onClick={() => handleItemClick("home")}>Dashboard</li>
            <li className={activeItem === "users" ? "active" : ""} onClick={() => handleItemClick("users")}>Users</li>
            <li className={activeItem === "product" ? "active" : ""} onClick={() => handleItemClick("product")}>Products</li>
            <li className={activeItem === "invoice" ? "active" : ""} onClick={() => handleItemClick("invoice")}>Invoice</li>
            <li className={activeItem === "record" ? "active" : ""} onClick={() => handleItemClick("record")}>Records</li>
            <li className={activeItem === "payment" ? "active" : ""} onClick={() => handleItemClick("payment")}>Payment</li>
            <li className={activeItem === "logout" ? "active" : ""} onClick={() => handleItemClick("logout")}>Logout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
