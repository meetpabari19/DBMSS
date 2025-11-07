// import React, { useEffect, useState } from "react";
// import "./AdminDashboard.css";

// export default function AdminDashboard() {
//   const [reports, setReports] = useState([]);
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:4000/api/admin/reports")
//       .then(res => res.json())
//       .then(data => { if (data.success) setReports(data.data); });

//     fetch("http://localhost:4000/api/admin/stats")
//       .then(res => res.json())
//       .then(data => { if (data.success) setStats(data); });
//   }, []);

//   return (
//     <div className="admin-dashboard">
//       <h2>Admin Dashboard</h2>

//       {stats && (
//         <div className="stats">
//           <p><strong>Total Reports:</strong> {stats.totalReports}</p>
//           <h3>Road Conditions:</h3>
//           <ul>
//             {stats.conditionCounts.map(c => (
//               <li key={c._id}>{c._id || "Unknown"}: {c.count}</li>
//             ))}
//           </ul>
//           <h3>Traffic Levels:</h3>
//           <ul>
//             {stats.trafficCounts.map(t => (
//               <li key={t._id}>{t._id || "Unknown"}: {t.count}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <h3>Recent Reports</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Vehicle</th>
//             <th>Location</th>
//             <th>Road</th>
//             <th>Traffic</th>
//             <th>Weather</th>
//             <th>Issues</th>
//             <th>Feedback</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reports.map((r) => (
//             <tr key={r._id}>
//               <td>{r.vehicle}</td>
//               <td>{r.location}</td>
//               <td>{r.roadCondition}</td>
//               <td>{r.traffic}</td>
//               <td>{r.weather}</td>
//               <td>{r.issues}</td>
//               <td>{r.feedback}</td>
//               <td>{new Date(r.createdAt).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [filterTraffic, setFilterTraffic] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/reports")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReports(data.data);
          setFilteredReports(data.data);
        }
      });

    fetch("http://localhost:4000/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data);
      });
  }, []);

  // Filtering and searching
  useEffect(() => {
    let result = reports;

    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.vehicle?.toLowerCase().includes(lower) ||
          r.location?.toLowerCase().includes(lower)
      );
    }

    if (filterCondition)
      result = result.filter((r) => r.roadCondition === filterCondition);

    if (filterTraffic)
      result = result.filter((r) => r.traffic === filterTraffic);

    setFilteredReports(result);
  }, [search, filterCondition, filterTraffic, reports]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {stats && (
        <div className="stats">
          <p><strong>Total Reports:</strong> {stats.totalReports}</p>
          <h3>Road Conditions:</h3>
          <ul>
            {stats.conditionCounts.map((c) => (
              <li key={c._id}>{c._id || "Unknown"}: {c.count}</li>
            ))}
          </ul>
          <h3>Traffic Levels:</h3>
          <ul>
            {stats.trafficCounts.map((t) => (
              <li key={t._id}>{t._id || "Unknown"}: {t.count}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by vehicle or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="select-filter">
        <select
          value={filterCondition}
          onChange={(e) => setFilterCondition(e.target.value)}
        >
          <option value="">All Conditions</option>
          <option value="Smooth">Smooth</option>
          <option value="Rough">Rough   </option>
          <option value="Potholes">Potholes</option>
          <option value="Under Construction">Under Construction</option>
          <option value="Flooded">Flooded</option>
          <option value="Blocked">Blocked</option>

        </select>

        <select
          value={filterTraffic}
          onChange={(e) => setFilterTraffic(e.target.value)}
        >
          <option value="">All Traffic</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Jammed">Jammed</option>
        </select>
        </div>
      </div>

      <h3>Recent Reports</h3>
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Location</th>
            <th>Road</th>
            <th>Traffic</th>
            <th>Weather</th>
            <th>Issues</th>
            <th>Feedback</th>
            <th>Coordinates</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((r) => (
            <tr key={r._id}>
              <td>{r.vehicle}</td>
              <td>{r.location}</td>
              <td>{r.roadCondition}</td>
              <td>{r.traffic}</td>
              <td>{r.weather}</td>
              <td>{r.issues}</td>
              <td>{r.feedback}</td>
              <td>
                {r.coordinates
                  ? `${r.coordinates.lat}, ${r.coordinates.lon}`
                  : "N/A"}
              </td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

