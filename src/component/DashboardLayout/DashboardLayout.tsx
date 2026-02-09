import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./DashboardLayout.css";

interface Props {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const [sectionTitle, setSectionTitle] = useState("Dashboard");

  return (
    <div className="dashboard-layout">
      <Sidebar onSectionChange={setSectionTitle} />
      <div className="main-content">
        <Topbar />
        <div className="dashboard-body">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
