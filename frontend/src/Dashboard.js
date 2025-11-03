// import React, { useState } from "react";
// export default function Dashboard({ token, onLogout }){
//   const [status,setStatus]=useState("Click get location"); const [info,setInfo]=useState(null);
//   async function getLocation(){
//     setStatus("Getting location...");
//     setInfo(null);
//     if (!navigator.geolocation){ setStatus("Geolocation not supported"); return; }
//     navigator.geolocation.getCurrentPosition(async pos => {
//       const lat = pos.coords.latitude; const lon = pos.coords.longitude;
//       // const lat = 19.912552; const lon = 73.707820;
//       // const lat = 13.0630227; const lon = 77.5930842;
//       // const lat = 22.813740; const lon = 72.833305;
//       setStatus(`Coords ${lat.toFixed(5)}, ${lon.toFixed(5)} - Fetching Data`);
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

export default function Dashboard({ token, onLogout }) {
  const [status, setStatus] = useState("Click get location");
  const [info, setInfo] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [roadType, setRoadType] = useState("");
  const [condition, setCondition] = useState("");

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

        setStatus(`Coords ${lat.toFixed(5)}, ${lon.toFixed(5)} - Fetching Data`);

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
      (err) => {
        setStatus("Location error: " + err.message);
      },
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

  // Open the dialog
  const handleReportClick = (road) => {
    setRoadType(road);
    setShowDialog(true);
  };

  // Submit condition report
  async function submitConditionReport() {
    if (!condition.trim()) {
      alert("Please enter a condition before submitting!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/reportCondition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          roadType,
          condition,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");

      alert("Condition submitted successfully!");
      setCondition("");
      setShowDialog(false);
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
                        <button onClick={() => handleReportClick(info.roadType)}>
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

      {/* Simple popup dialog */}
      {showDialog && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3>Report Road Condition</h3>
            <p><b>Road Type:</b> {roadType}</p>
            <textarea
              rows="4"
              placeholder="Describe the condition (e.g., potholes, smooth, flooded...)"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              style={{ width: "100%" }}
            ></textarea>
            <br />
            <button onClick={submitConditionReport}>Submit</button>
            <button onClick={() => setShowDialog(false)} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

