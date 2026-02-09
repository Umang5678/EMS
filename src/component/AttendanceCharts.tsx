// import React, { useEffect, useState, useMemo } from "react";
// import moment from "moment";
// import api from "../../axiosConfig";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// /* -------------------- Types -------------------- */

// interface DashboardDay {
//   date: string;
//   seconds: number;
//   status: "present" | "absent";
// }

// const COLORS = ["#3b82f6", "#e5e7eb"];

// /* -------------------- Helpers -------------------- */

// const formatDuration = (seconds: number) => {
//   const h = Math.floor(seconds / 3600);
//   const m = Math.floor((seconds % 3600) / 60);
//   const s = seconds % 60;
//   return `${h}h ${m}m ${s}s`;
// };

// /* -------------------- Charts -------------------- */

// const HistoryCharts: React.FC<{ data: DashboardDay[] }> = ({ data }) => (
//   <div style={{ display: "flex", gap: 20 }}>
//     {/* Bar Chart */}
//     <ResponsiveContainer width="50%" height={300}>
//       <BarChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" tickFormatter={(d) => moment(d).format("DD")} />
//         <YAxis tickFormatter={(v) => `${Math.floor(v / 3600)}h`} />
//         <Tooltip
//           formatter={(v: number, _: any, p: any) =>
//             p.payload.status === "absent" ? "Absent" : formatDuration(v)
//           }
//         />
//         <Legend />
//         <Bar dataKey="seconds" fill="#3b82f6" name="Worked Time" />
//       </BarChart>
//     </ResponsiveContainer>

//     {/* Line Chart */}
//     <ResponsiveContainer width="50%" height={300}>
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" />
//         <YAxis tickFormatter={(v) => `${Math.floor(v / 3600)}h`} />
//         <Tooltip
//           formatter={(v: number, _: any, p: any) =>
//             p.payload.status === "absent" ? "Absent" : formatDuration(v)
//           }
//         />
//         <Legend />
//         <Line
//           type="monotone"
//           dataKey="seconds"
//           stroke="#3b82f6"
//           strokeWidth={2}
//           name="Worked Time"
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   </div>
// );

// const MonthPie: React.FC<{
//   month: string;
//   worked: number;
//   target: number;
// }> = ({ month, worked, target }) => {
//   const data = [
//     { name: "Worked", value: worked },
//     { name: "Remaining", value: Math.max(target - worked, 0) },
//   ];

//   return (
//     <div style={{ flex: 1, textAlign: "center" }}>
//       <h3>{moment(month).format("MMMM YYYY")} Hours</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie data={data} dataKey="value" innerRadius={60} outerRadius={100}>
//             {data.map((_, i) => (
//               <Cell key={i} fill={COLORS[i]} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(v: number, name: string) =>
//               `${name}: ${formatDuration(v)}`
//             }
//           />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//       <strong>Worked: {formatDuration(worked)}</strong>
//     </div>
//   );
// };

// /* -------------------- Main Component -------------------- */

// const AttendanceCharts: React.FC = () => {
//   const [month, setMonth] = useState(moment().format("YYYY-MM"));
//   const [days, setDays] = useState<DashboardDay[]>([]);
//   const [totalSeconds, setTotalSeconds] = useState(0);
//   const [targetSeconds, setTargetSeconds] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchDashboardMonth = async (selectedMonth: string) => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No token found");
//         return;
//       }

//       const res = await api.post(
//         "/attendance/dashboard/month",
//         { month: selectedMonth },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!res.data.success) {
//         throw new Error(res.data.message);
//       }

//       setDays(res.data.data.daily);
//       setTotalSeconds(res.data.data.total_seconds);
//       setTargetSeconds(res.data.data.target_seconds);
//     } catch (err) {
//       setError("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardMonth(month);
//   }, [month]);

//   const chartData = useMemo(
//     () =>
//       days.map((d) => ({
//         ...d,
//         date: moment(d.date).format("DD MMM"),
//       })),
//     [days],
//   );

//   return (
//     <div style={{ width: "100%", marginTop: 20 }}>
//       {/* Month Selector */}
//       <div style={{ marginBottom: 20 }}>
//         <label style={{ fontWeight: 600 }}>Select Month:</label>{" "}
//         <input
//           type="month"
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//         />
//       </div>

//       {loading && <p>Loading dashboard...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loading && !error && chartData.length === 0 && (
//         <p>No attendance data</p>
//       )}

//       {!loading && !error && chartData.length > 0 && (
//         <>
//           <HistoryCharts data={chartData} />
//           <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
//             <MonthPie
//               month={month}
//               worked={totalSeconds}
//               target={targetSeconds}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AttendanceCharts;

import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import api from "../../axiosConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ---------------- Types ---------------- */

interface AttendanceAPI {
  date: string;
  hours_worked?: string;
  status: "present" | "absent";
}

interface ChartDay {
  date: string;
  seconds: number;
  status: "present" | "absent";
}

const COLORS = ["#3b82f6", "#e5e7eb"];

/* ---------------- Helpers ---------------- */

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

/* ---------------- Charts ---------------- */

const HistoryCharts: React.FC<{ data: ChartDay[] }> = ({ data }) => (
  <div style={{ display: "flex", gap: 20 }}>
    <ResponsiveContainer width="50%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(v) => `${Math.floor(v / 3600)}h`} />
        <Tooltip
          formatter={(v: number, _: any, p: any) =>
            p.payload.status === "absent" ? "Absent" : formatDuration(v)
          }
        />
        <Legend />
        <Bar dataKey="seconds" fill="#3b82f6" name="Worked Time" />
      </BarChart>
    </ResponsiveContainer>

    <ResponsiveContainer width="50%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(v) => `${Math.floor(v / 3600)}h`} />
        <Tooltip formatter={(v: number) => formatDuration(v)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="seconds"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Worked Time"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const MonthPie: React.FC<{
  month: string;
  worked: number;
  target: number;
}> = ({ month, worked, target }) => {
  const data = [
    { name: "Worked", value: worked },
    { name: "Remaining", value: Math.max(target - worked, 0) },
  ];

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <h3>{moment(month).format("MMMM YYYY")}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={100}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => formatDuration(v)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <strong>Worked: {formatDuration(worked)}</strong>
    </div>
  );
};

/* ---------------- Main ---------------- */

const AttendanceCharts: React.FC = () => {
  const [month, setMonth] = useState(moment().format("YYYY-MM"));
  const [records, setRecords] = useState<AttendanceAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }

      const res = await api.post(
        "/attendance/list?page=1&limit=50",
        {
          start_date: moment(month).startOf("month").format("YYYY-MM-DD"),
          end_date: moment(month).endOf("month").format("YYYY-MM-DD"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRecords(res.data.data.attendance || []);
    } catch {
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month]);

  /* ---------- Chart Data ---------- */

  const chartData: ChartDay[] = useMemo(() => {
    return records.map((r) => ({
      date: moment(r.date).format("DD MMM"),
      seconds: r.hours_worked ? Number(r.hours_worked) * 3600 : 0,
      status: r.status,
    }));
  }, [records]);

  const totalSeconds = useMemo(
    () => chartData.reduce((a, b) => a + b.seconds, 0),
    [chartData],
  );

  const workingDays = useMemo(
    () =>
      chartData.filter((d) => {
        const day = moment(d.date, "DD MMM").day();
        return day !== 0 && day !== 6;
      }).length,
    [chartData],
  );

  const targetSeconds = workingDays * 8 * 3600;

  return (
    <div style={{ width: "100%", marginTop: 20 }}>
      <label>
        Month:{" "}
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </label>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && chartData.length > 0 && (
        <>
          <HistoryCharts data={chartData} />
          <div style={{ marginTop: 40 }}>
            <MonthPie
              month={month}
              worked={totalSeconds}
              target={targetSeconds}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceCharts;
