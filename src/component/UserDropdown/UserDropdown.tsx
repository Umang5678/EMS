import React from "react";
import "./UserDropdown.css";

const UserDropdown: React.FC = () => {
  return (
    <div className="user-dropdown">
      <ul>
        <li>My Account</li>
        <li>Logout</li>
      </ul>
    </div>
  );
};

export default UserDropdown;
