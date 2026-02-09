import React, { useState, useEffect, useRef } from "react";
import "./Topbar.css";

import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import api from "./../../../axiosConfig";
import { FiLogOut } from "react-icons/fi";

const routeTitleMap: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/attendance-list": "Attendance Records",
  "/staffattendance": "Staff Attendance",
  "/user-list": "User Management",
  "/LeaveAdmin": "Staff Leave Requests",
  "/leave": "Leave Request",
};

const Topbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "",
  });

  const heading = routeTitleMap[location.pathname] || "Welcome";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserInfo((prev) => ({
          ...prev,
          firstName: parsedUser.first_name || parsedUser.firstname || "",
          lastName: parsedUser.last_name || parsedUser.lastname || "",
          userType: parsedUser.user_type || "",
        }));
      } catch (error) {
        console.error("❌ Failed to parse user:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleProfileClick = async () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || user.user_type !== "staff") return;

      try {
        const res = await api.get(`/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const data = res.data.data;
          setUserInfo({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone_number,
            userType: data.user_type,
          });
        }
      } catch (err: any) {
        console.error("❌ Error fetching profile:", err.response?.data || err);
      }
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-info">
          <h2 className="topbar-heading">{heading}</h2>
        </div>

        <div className="topbar-user" ref={dropdownRef}>
          <FaUserCircle
            size={28}
            style={{ cursor: "pointer" }}
            onClick={handleProfileClick}
          />
          {dropdownOpen && (
            <div className="profile-dropdown active">
              {userInfo.userType === "staff" && (
                <button
                  className="dropdown-btn"
                  onClick={() => {
                    setShowProfileModal(true);
                    setDropdownOpen(false);
                  }}
                >
                  👤 User Profile
                </button>
              )}
              <button
                className="dropdown-btn"
                onClick={() => {
                  setShowLogoutModal(true);
                  setDropdownOpen(false);
                }}
              >
                <FiLogOut style={{ marginRight: "8px" }} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="modal"
            style={{ width: 430 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-icon"
              onClick={() => setShowProfileModal(false)}
            >
              &times;
            </button>
            <h2 className="modal-title">User Profile</h2>
            <div className="profile-info">
              <div className="info-row">
                <strong>First Name:</strong> {userInfo.firstName}
              </div>
              <div className="info-row">
                <strong>Last Name:</strong> {userInfo.lastName}
              </div>
              <div className="info-row">
                <strong>Email:</strong> {userInfo.email}
              </div>
              <div className="info-row">
                <strong>Phone:</strong> {userInfo.phone}
              </div>
              <div className="info-row">
                <strong>User Type:</strong> {userInfo.userType}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;

// import React, { useState, useEffect, useRef } from "react";
// import "./Topbar.css";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "./../../../axiosConfig";
// import { FiLogOut } from "react-icons/fi";

// const routeTitleMap: { [key: string]: string } = {
//   "/dashboard": "Dashboard",
//   "/attendance-list": "Attendance Records",
//   "/staffattendance": "Staff Attendance",
//   "/user-list": "User Management",
//   "/LeaveAdmin": "Staff Leave Requests",
//   "/leave": "Leave Request",
// };

// const Topbar: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   const [theme, setTheme] = useState("light");

//   const [userInfo, setUserInfo] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     userType: "",
//   });

//   const heading = routeTitleMap[location.pathname] || "Welcome";

//   // Load theme from localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setTheme(savedTheme);
//     document.body.className = savedTheme;
//   }, []);

//   // Toggle theme
//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.body.className = newTheme;
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserInfo((prev) => ({
//           ...prev,
//           firstName: parsedUser.first_name || parsedUser.firstname || "",
//           lastName: parsedUser.last_name || parsedUser.lastname || "",
//           userType: parsedUser.user_type || "",
//         }));
//       } catch (error) {
//         console.error("❌ Failed to parse user:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }
//     };

//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   const handleProfileClick = async () => {
//     setDropdownOpen((prev) => !prev);
//     if (!dropdownOpen) {
//       const token = localStorage.getItem("token");
//       const user = JSON.parse(localStorage.getItem("user") || "{}");

//       if (!token || user.user_type !== "staff") return;

//       try {
//         const res = await api.get(`/user/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.data.success) {
//           const data = res.data.data;
//           setUserInfo({
//             firstName: data.first_name,
//             lastName: data.last_name,
//             email: data.email,
//             phone: data.phone_number,
//             userType: data.user_type,
//           });
//         }
//       } catch (err: any) {
//         console.error("❌ Error fetching profile:", err.response?.data || err);
//       }
//     }
//   };

//   const confirmLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   return (
//     <>
//       <div className="topbar">
//         <div className="topbar-info">
//           <h2 className="topbar-heading">{heading}</h2>
//         </div>

//         <div
//           className="topbar-actions"
//           style={{ display: "flex", alignItems: "center", gap: "12px" }}
//         >
//           {/* Theme Toggle */}
//           <button className="theme-toggle-btn" onClick={toggleTheme}>
//             {theme === "light" ? "🌙" : "☀️"}
//           </button>

//           {/* Profile Dropdown */}
//           <div className="topbar-user" ref={dropdownRef}>
//             <FaUserCircle
//               size={28}
//               style={{ cursor: "pointer" }}
//               onClick={handleProfileClick}
//             />
//             {dropdownOpen && (
//               <div className="profile-dropdown active">
//                 {userInfo.userType === "staff" && (
//                   <button
//                     className="dropdown-btn"
//                     onClick={() => {
//                       setShowProfileModal(true);
//                       setDropdownOpen(false);
//                     }}
//                   >
//                     👤 User Profile
//                   </button>
//                 )}
//                 <button
//                   className="dropdown-btn"
//                   onClick={() => {
//                     setShowLogoutModal(true);
//                     setDropdownOpen(false);
//                   }}
//                 >
//                   <FiLogOut style={{ marginRight: "8px" }} /> Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Logout Modal */}
//       {showLogoutModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h2>Confirm Logout</h2>
//             <p>Are you sure you want to logout?</p>
//             <div className="modal-actions">
//               <button className="confirm-btn" onClick={confirmLogout}>
//                 Yes, Logout
//               </button>
//               <button
//                 className="cancel-btn"
//                 onClick={() => setShowLogoutModal(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Profile Modal */}
//       {showProfileModal && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowProfileModal(false)}
//         >
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <button
//               className="close-icon"
//               onClick={() => setShowProfileModal(false)}
//             >
//               &times;
//             </button>
//             <h2 className="modal-title">User Profile</h2>
//             <div className="profile-info">
//               <div className="info-row">
//                 <strong>First Name:</strong> {userInfo.firstName}
//               </div>
//               <div className="info-row">
//                 <strong>Last Name:</strong> {userInfo.lastName}
//               </div>
//               <div className="info-row">
//                 <strong>Email:</strong> {userInfo.email}
//               </div>
//               <div className="info-row">
//                 <strong>Phone:</strong> {userInfo.phone}
//               </div>
//               <div className="info-row">
//                 <strong>User Type:</strong> {userInfo.userType}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Topbar;
