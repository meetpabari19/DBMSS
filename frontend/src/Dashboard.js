// import React, { useState } from "react";
// export default function Dashboard({ token, onLogout }){
//   const [status,setStatus]=useState("Click get location"); const [info,setInfo]=useState(null);
//   async function getLocation(){
//     setStatus("Getting location...");
//     setInfo(null);
//     if (!navigator.geolocation){ setStatus("Geolocation not supported"); return; }
//     navigator.geolocation.getCurrentPosition(async pos => {
//       const lat = pos.coords.latitude; const lon = pos.coords.longitude;
//       setStatus(`Coords ${lat.toFixed(5)}, ${lon.toFixed(5)} — querying backend...`);
//       try {
//         const res = await fetch(`http://localhost:4000/api/road-info?lat=${lat}&lon=${lon}`, { headers: { Authorization: "Bearer "+token } });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Failed");
//         setInfo(data); setStatus("Fetched road info");
//       } catch(err){ setStatus("Error: "+err.message); }
//     }, err => { setStatus("Location error: "+err.message); }, { enableHighAccuracy:true, timeout:15000 });
//   }

//   async function checkSpeed(vehicleClass){
//     if (!info || !info.roadType) return;
//     const currentSpeed = prompt("Enter current speed (km/h) for "+vehicleClass);
//     if (currentSpeed==null) return;
//     try {
//       const res = await fetch("http://localhost:4000/api/checkSpeed", { method:"POST", headers: { "Content-Type":"application/json", Authorization: "Bearer "+token }, body: JSON.stringify({ vehicleClass, roadType: info.roadType, currentSpeed }) });
//       const data = await res.json();
//       alert(JSON.stringify(data));
//     } catch(err){ alert("Error: "+err.message); }
//   }

//   return (
//   <div className="card">
//   <div className="row">
//   <h2>Dashboard</h2>
//   <button onClick={onLogout}>Logout</button>
//   </div>
//   <p>{status}</p><button onClick={getLocation}>Get Location & Road Type</button>
//   {info && (<div className="result">
//   {!info.found ? (<p>No highway found. Raw tags: <pre>{JSON.stringify(info.rawTags||{},null,2)}</pre></p>) : (<div><h3>Detected Road</h3><p><b>OSM tag:</b> {info.highwayTag}</p><p><b>Road type:</b> {info.roadType}</p><h3>Speed limits (km/h)</h3><table><thead><tr><th>Vehicle</th><th>Speed</th><th></th></tr></thead><tbody>{info.speeds.map(s=>(<tr key={s.vehicleClass}><td>{s.vehicleClass}</td><td>{s.maxSpeed==null?"—":s.maxSpeed}</td><td><button>Report Road Condition</button></td></tr>))}</tbody></table></div>)}</div>)}</div>); }
// // }    onClick={()=>checkSpeed(s.vehicleClass)}

import React, { useState } from "react";
import Report from "./Report";
import "./Dashboard.css"; // make sure CSS imported

export default function Dashboard({ token, onLogout }) {
  const [status, setStatus] = useState("Click get location");
  const [info, setInfo] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });

  // 🌍 Get user location + road info
  async function getLocation() {
    setStatus("Getting location...");
    setInfo(null);
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setUserLocation({
          lat: lat.toFixed(5),
          lon: lon.toFixed(5),
        });

        setStatus(`Coords: ${lat.toFixed(5)}, ${lon.toFixed(5)} — querying backend...`);

        try {
          const res = await fetch(
            `http://localhost:4000/api/road-info?lat=${lat}&lon=${lon}`,
            { headers: { Authorization: "Bearer " + token } }
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed");
          setInfo(data);
          setStatus("Fetched road info");
        } catch (err) {
          setStatus("Error: " + err.message);
        }
      },
      (err) => setStatus("Location error: " + err.message),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function checkSpeed(vehicleClass) {
    if (!info || !info.roadType) return;
    const currentSpeed = prompt("Enter current speed (km/h) for " + vehicleClass);
    if (currentSpeed == null) return;
    try {
      const res = await fetch("http://localhost:4000/api/checkSpeed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          vehicleClass,
          roadType: info.roadType,
          currentSpeed,
        }),
      });
      const data = await res.json();
      alert(JSON.stringify(data));
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div className="card">
      <div className="row">
        <h2>Dashboard</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <p>{status}</p>
      <button onClick={getLocation}>Get Location & Road Type</button>

      {userLocation.lat && userLocation.lon && (
        <p style={{ marginTop: "10px", color: "gray" }}>
          📍 <b>Latitude:</b> {userLocation.lat}, <b>Longitude:</b> {userLocation.lon}
        </p>
      )}

      {info && (
        <div className="result">
          {!info.found ? (
            <p>
              No highway found. Raw tags:{" "}
              <pre>{JSON.stringify(info.rawTags || {}, null, 2)}</pre>
            </p>
          ) : (
            <div>
              <h3>Detected Road</h3>
              <p>
                <b>OSM tag:</b> {info.highwayTag}
              </p>
              <p>
                <b>Road type:</b> {info.roadType}
              </p>

              <h3>Speed limits (km/h)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Speed</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {info.speeds.map((s) => (
                    <tr key={s.vehicleClass}>
                      <td>{s.vehicleClass}</td>
                      <td>{s.maxSpeed == null ? "—" : s.maxSpeed}</td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedVehicle(s.vehicleClass);
                            setShowReport(true);
                          }}
                          className="report-btn"
                        >
                          Report Road Condition
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 🧩 Report Dialog */}
      {showReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Report
              vehicle={selectedVehicle}
              location={userLocation}
              onClose={() => setShowReport(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}