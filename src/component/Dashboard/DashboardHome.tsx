// import React, { useEffect, useState } from "react";
// import AttendanceChart from "../AttendanceCharts";
// import PointCategoryManager from "../Point/Point";

// interface User {
//   first_name: string;
//   last_name: string;
//   user_type?: string;
// }

// const DashboardHome: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (err) {
//         console.error("Error parsing user:", err);
//       }
//     }
//   }, []);

//   const getFullName = () => {
//     if (!user) return "User";
//     const first =
//       user.first_name?.[0]?.toUpperCase() + user.first_name?.slice(1) || "";
//     const last =
//       user.last_name?.[0]?.toUpperCase() + user.last_name?.slice(1) || "";
//     return `${first} ${last}`.trim();
//   };

//   return (
//     <div className="dashboard-home">
//       <h2>Welcome, {getFullName()}!</h2>

//       {user?.user_type?.toLowerCase() === "staff" ? (
//         <AttendanceChart />
//       ) : user?.user_type?.toLowerCase() === "admin" ? (
//         <PointCategoryManager />
//       ) : (
//         <p>Welcome! Please contact admin if you don't see your dashboard.</p>
//       )}
//     </div>
//   );
// };

// export default DashboardHome;
import React, { useEffect, useState } from "react";
import AttendanceCharts from "../../component/AttendanceCharts";
import PointCategoryManager from "../Point/Point";

const DashboardHome: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="dashboard-home">
      <h2>Welcome!</h2>

      {user?.role?.toLowerCase() === "staff" ? (
        <AttendanceCharts />
      ) : user?.role?.toLowerCase() === "admin" ? (
        <PointCategoryManager />
      ) : (
        <p>Welcome! Please contact admin.</p>
      )}
    </div>
  );
};

export default DashboardHome;
