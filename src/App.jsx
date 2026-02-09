import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login/Login";
import DashboardLayout from "./component/DashboardLayout/DashboardLayout";
import UserList from "./component/Userlist/Userlist";
import StaffAttendance from "./component/Staffattendance/Staffattendance";
import List from "./component/LIst/List";
import ProtectedRoute from "./component/ProtectedRoute";
import DashboardHome from "./component/Dashboard/DashboardHome";
import Leave from "./component/Leave/Leave";
import LeaveAdmin from "./component/Leave/LeaveAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-list"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staffattendance"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StaffAttendance />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance-list"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <List />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Leave />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/LeaveAdmin"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <LeaveAdmin />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
