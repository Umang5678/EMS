// import React, { useEffect, useState } from "react";
// import "./Sidebar.css";
// import {
//   FaTachometerAlt,
//   FaBusinessTime,
//   FaPowerOff,
//   FaCog,
//   FaClock,
//   FaCalendarAlt,
//   FaRegCalendarCheck,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import api from "./../../../axiosConfig";
// import { useLocation } from "react-router-dom";

// interface User {
//   first_name: string;
//   last_name: string;
//   user_type?: string;
// }

// interface SidebarProps {
//   onSectionChange: (section: string) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ onSectionChange }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [markLoading, setMarkLoading] = useState(false);
//   const [activeItem, setActiveItem] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (err) {
//         console.error("❌ Error parsing user:", err);
//       }
//     } else {
//       console.warn("⚠️ No user found in localStorage");
//     }
//   }, []);

//   const handleItemClick = (sectionName: string, path?: string) => {
//     setActiveItem(sectionName);
//     onSectionChange(sectionName);
//     if (path) navigate(path);
//   };

//   const fetchUserList = async () => {
//     try {
//       const response = await api.get("/user/list");
//       if (response.data.success) {
//       }
//     } catch (error: any) {
//       console.error("Error fetching user list", error);
//     }
//   };
//   const location = useLocation();
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (err) {
//         console.error("❌ Error parsing user:", err);
//       }
//     }

//     switch (location.pathname) {
//       case "/dashboard":
//         setActiveItem("Dashboard");
//         break;
//       case "/user-list":
//         setActiveItem("User List");
//         break;
//       case "/staffattendance":
//         setActiveItem("Staff Attendance");
//         break;
//       case "/attendance-list":
//         setActiveItem("Attendance Record");
//         break;
//       case "/leave":
//         setActiveItem("Leave");
//         break;
//       case "/LeaveAdmin":
//         setActiveItem("Leavead");
//         break;
//       default:
//         setActiveItem("");
//     }
//   }, [location.pathname]);

//   return (
//     <div className="sidebar">
//       <div className="sidebar__profile">
//         <h2>
//           {user ? (
//             `${user.first_name.charAt(0).toUpperCase()}${user.first_name.slice(
//               1
//             )} ${user.last_name.charAt(0).toUpperCase()}${user.last_name.slice(
//               1
//             )}`
//           ) : (
//             <>
//               Loading... <span className="spinner"></span>
//             </>
//           )}
//         </h2>

//         <p>{user?.user_type || "Admin"}</p>
//       </div>

//       <div className="sidebar__section">
//         <button
//           className={`sidebar__link ${
//             activeItem === "Dashboard" ? "clicked" : ""
//           }`}
//           onClick={() => handleItemClick("Dashboard", "/dashboard")}
//         >
//           <FaTachometerAlt /> Dashboard
//         </button>
//       </div>

//       {user?.user_type === "admin" && (
//         <div className="sidebar__section">
//           <button
//             className={`sidebar__link ${
//               activeItem === "User List" ? "clicked" : ""
//             }`}
//             onClick={() => {
//               fetchUserList();
//               handleItemClick("User List", "/user-list");
//             }}
//           >
//             <FaBusinessTime /> User List
//           </button>
//         </div>
//       )}

//       {user?.user_type === "staff" && (
//         <div className="sidebar__section">
//           <button
//             className={`sidebar__link ${
//               activeItem === "Staff Attendance" ? "clicked" : ""
//             }`}
//             onClick={() =>
//               handleItemClick("Staff Attendance", "/staffattendance")
//             }
//             disabled={markLoading}
//           >
//             <FaClock />
//             {markLoading ? "Marking..." : "Staff Attendance"}
//           </button>
//         </div>
//       )}
//       {user?.user_type === "staff" && (
//         <div className="sidebar__section">
//           <button
//             className={`sidebar__link ${
//               activeItem === "Attendance Record" ? "clicked" : ""
//             }`}
//             onClick={() =>
//               handleItemClick("Attendance Record", "/attendance-list")
//             }
//           >
//             <FaBusinessTime /> Attendance Record
//           </button>
//         </div>
//       )}
//       {user?.user_type === "staff" && (
//         <div className="sidebar__section">
//           <button
//             className={`sidebar__link ${
//               activeItem === "Leave" ? "clicked" : ""
//             }`}
//             onClick={() => handleItemClick("Leave", "/leave")}
//           >
//             <FaCalendarAlt /> Leave Request
//           </button>
//         </div>
//       )}

//       {user?.user_type === "admin" && (
//         <div className="sidebar__section">
//           <button
//             className={`sidebar__link ${
//               activeItem === "Leavead" ? "clicked" : ""
//             }`}
//             onClick={() => handleItemClick("Leavead", "/LeaveAdmin")}
//           >
//             <FaRegCalendarCheck /> Staff Leave
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import {
  FaTachometerAlt,
  FaBusinessTime,
  FaPowerOff,
  FaCog,
  FaClock,
  FaCalendarAlt,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "./../../../axiosConfig";
import { useLocation } from "react-router-dom";

// interface User {
//   first_name: string;
//   last_name: string;
//   user_type?: string;
// }
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
}

interface SidebarProps {
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSectionChange }) => {
  const [user, setUser] = useState<User | null>(null);
  const [markLoading, setMarkLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("❌ Error parsing user:", err);
      }
    } else {
      console.warn("⚠️ No user found in localStorage");
    }
  }, []);

  const handleItemClick = (sectionName: string, path?: string) => {
    setActiveItem(sectionName);
    onSectionChange(sectionName);
    if (path) navigate(path);
  };

  const fetchUserList = async () => {
    try {
      const response = await api.get("/user/list");
      if (response.data.success) {
      }
    } catch (error: any) {
      console.error("Error fetching user list", error);
    }
  };
  const location = useLocation();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("❌ Error parsing user:", err);
      }
    }

    switch (location.pathname) {
      case "/dashboard":
        setActiveItem("Dashboard");
        break;
      case "/user-list":
        setActiveItem("User List");
        break;
      case "/staffattendance":
        setActiveItem("Staff Attendance");
        break;
      case "/attendance-list":
        setActiveItem("Attendance Record");
        break;
      case "/leave":
        setActiveItem("Leave");
        break;
      case "/LeaveAdmin":
        setActiveItem("Leavead");
        break;
      default:
        setActiveItem("");
    }
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <h2>
          {user ? (
            user.name
          ) : (
            <>
              Loading... <span className="spinner"></span>
            </>
          )}
        </h2>

        <p>{user?.role || "Admin"}</p>
      </div>

      <div className="sidebar__section">
        <button
          className={`sidebar__link ${
            activeItem === "Dashboard" ? "clicked" : ""
          }`}
          onClick={() => handleItemClick("Dashboard", "/dashboard")}
        >
          <FaTachometerAlt /> Dashboard
        </button>
      </div>

      {user?.role === "admin" && (
        <div className="sidebar__section">
          <button
            className={`sidebar__link ${
              activeItem === "User List" ? "clicked" : ""
            }`}
            onClick={() => {
              fetchUserList();
              handleItemClick("User List", "/user-list");
            }}
          >
            <FaBusinessTime /> User List
          </button>
        </div>
      )}

      {user?.role === "staff" && (
        <div className="sidebar__section">
          <button
            className={`sidebar__link ${
              activeItem === "Staff Attendance" ? "clicked" : ""
            }`}
            onClick={() =>
              handleItemClick("Staff Attendance", "/staffattendance")
            }
            disabled={markLoading}
          >
            <FaClock />
            {markLoading ? "Marking..." : "Staff Attendance"}
          </button>
        </div>
      )}
      {user?.role === "staff" && (
        <div className="sidebar__section">
          <button
            className={`sidebar__link ${
              activeItem === "Attendance Record" ? "clicked" : ""
            }`}
            onClick={() =>
              handleItemClick("Attendance Record", "/attendance-list")
            }
          >
            <FaBusinessTime /> Attendance Record
          </button>
        </div>
      )}
      {user?.role === "staff" && (
        <div className="sidebar__section">
          <button
            className={`sidebar__link ${
              activeItem === "Leave" ? "clicked" : ""
            }`}
            onClick={() => handleItemClick("Leave", "/leave")}
          >
            <FaCalendarAlt /> Leave Request
          </button>
        </div>
      )}

      {user?.role === "admin" && (
        <div className="sidebar__section">
          <button
            className={`sidebar__link ${
              activeItem === "Leavead" ? "clicked" : ""
            }`}
            onClick={() => handleItemClick("Leavead", "/LeaveAdmin")}
          >
            <FaRegCalendarCheck /> Staff Leave
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
