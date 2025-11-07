import React, { useState, useEffect } from "react";
import "./Report.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Report({ onClose, vehicle }) {
  const [roadCondition, setRoadCondition] = useState("");
  const [traffic, setTraffic] = useState("");
  const [weather, setWeather] = useState("");
  const [issues, setIssues] = useState("");
  const [feedback, setFeedback] = useState("");
  const [coords, setCoords] = useState({ lat: null, lon: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // const { latitude, longitude } = pos.coords;
          // const latitude = 18.806813;
          // const longitude= 73.319644;

          const latitude = 21.863221;
          const longitude= 72.949822;
          setCoords({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.error(err);
          toast.warn("Location access denied!");
          setCoords({ lat: "Access Denied", lon: "Access Denied" });
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser!");
      setCoords({ lat: "Not Supported", lon: "Not Supported" });
    }
  }, []);


  const handleSubmit = async () => {
    if (!roadCondition || !traffic || !weather) {
      toast.warning("⚠️ Please select all main conditions before submitting.");
      return;
    }

    const reportData = {
      vehicle,
      coordinates: coords,
      roadCondition,
      traffic,
      weather,
      issues,
      feedback,
    };

    try {
      const res = await fetch("http://localhost:4000/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Report saved successfully!");
        setTimeout(() => onClose(),2000);
      } else {
        toast.error(" Failed to save report.");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      toast.error("Error while saving report.");
    }
  };


  const renderOptions = (options, selected, setSelected) =>
    options.map((opt) => (
      <button
        key={opt}
        type="button"
        className={`option-btn ${selected === opt ? "selected" : ""}`}
        onClick={() => setSelected(opt)}
      >
        {opt}
      </button>
    ));

  const roadConditions = [
    "Smooth",
    "Rough",
    "Potholes",
    "Flooded",
    "Blocked",
    "Under Construction",
  ];

  const trafficLevels = ["Low", "Moderate", "Heavy", "Jammed"];
  const weatherImpacts = ["Clear", "Rainy", "Foggy", "Stormy"];
  const issueTypes = [
    "Accident Zone",
    "Poor Lighting",
    "No Sign Boards",
    "Road Blocked",
    "None",
  ];

  return (
    <div className="report-overlay">
      <ToastContainer position="top-right" theme="colored" />

      <div className="report-box">
        <h2>Report Road Condition</h2>
        <p>
          <b>Vehicle:</b> {vehicle}
        </p>
        <p className="small-text">
          <b>Location:</b>{" "}
          {coords.lat && coords.lon
            ? `Latitude: ${coords.lat.toFixed(5)}, Longitude: ${coords.lon.toFixed(5)}`
            : "Fetching coordinates..."}
        </p>

        <div className="section">
          <h3>Overall Road Condition</h3>
          <div className="option-group">
            {renderOptions(roadConditions, roadCondition, setRoadCondition)}
          </div>
        </div>

        <div className="section">
          <h3>Traffic Level</h3>
          <div className="option-group">
            {renderOptions(trafficLevels, traffic, setTraffic)}
          </div>
        </div>

        <div className="section">
          <h3>Weather Impact</h3>
          <div className="option-group">
            {renderOptions(weatherImpacts, weather, setWeather)}
          </div>
        </div>

        <div className="section">
          <h3>Other Issues</h3>
          <div className="option-group">
            {renderOptions(issueTypes, issues, setIssues)}
          </div>
        </div>

        <div className="section">
          <h3>Additional Feedback</h3>
          <textarea
            rows="3"
            placeholder="Describe more details"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>

        <div className="report-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}


































// import React, { useState, useEffect } from "react";
// import "./Report.css";

// export default function Report({ onClose, vehicle }) {
//   const [roadCondition, setRoadCondition] = useState("");
//   const [traffic, setTraffic] = useState("");
//   const [weather, setWeather] = useState("");
//   const [issues, setIssues] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [coords, setCoords] = useState({ lat: null, lon: null });

//   // ✅ Fetch user's coordinates
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords;
//           setCoords({ lat: latitude, lon: longitude });
//         },
//         (err) => {
//           console.error(err);
//           setCoords({ lat: "Access Denied", lon: "Access Denied" });
//         }
//       );
//     } else {
//       setCoords({ lat: "Not Supported", lon: "Not Supported" });
//     }
//   }, []);

//   // ✅ Submit report to backend
//   const handleSubmit = async () => {
//     if (!roadCondition || !traffic || !weather) {
//       alert("⚠️ Please select all main conditions before submitting.");
//       return;
//     }

//     const reportData = {
//       vehicle,
//       coordinates: coords,
//       roadCondition,
//       traffic,
//       weather,
//       issues,
//       feedback,
//     };

//     try {
//       const res = await fetch("http://localhost:4000/api/report", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(reportData),
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert("✅ Report saved successfully!");
//         onClose();
//       } else {
//         alert("❌ Failed to save report.");
//       }
//     } catch (err) {
//       console.error("Error submitting report:", err);
//       alert("⚠️ Error while saving report.");
//     }
//   };

//   // ✅ Reusable button group
//   const renderOptions = (options, selected, setSelected) =>
//     options.map((opt) => (
//       <button
//         key={opt}
//         type="button" // prevent reload
//         className={`option-btn ${selected === opt ? "selected" : ""}`}
//         onClick={() => setSelected(opt)}
//       >
//         {opt}
//       </button>
//     ));

//   const roadConditions = [
//     "Smooth",
//     "Rough",
//     "Potholes",
//     "Flooded",
//     "Blocked",
//     "Under Construction",
//   ];

//   const trafficLevels = ["Low", "Moderate", "Heavy", "Jammed"];
//   const weatherImpacts = ["Clear", "Rainy", "Foggy", "Stormy"];
//   const issueTypes = [
//     "Accident Zone",
//     "Poor Lighting",
//     "No Sign Boards",
//     "Road Blocked",
//     "None"    
//   ];

//   return (
//     <div className="report-overlay">
//       <div className="report-box">
//         <h2>Report Road Condition</h2>
//         <p>
//           <b>Vehicle:</b> {vehicle}
//         </p>
//         <p className="small-text">
//           <b>Location:</b>{" "}
//           {coords.lat && coords.lon
//             ? `Latitude: ${coords.lat.toFixed(5)}, Longitude: ${coords.lon.toFixed(5)}`
//             : "Fetching coordinates..."}
//         </p>

//         <div className="section">
//           <h3>Overall Road Condition</h3>
//           <div className="option-group">
//             {renderOptions(roadConditions, roadCondition, setRoadCondition)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Traffic Level</h3>
//           <div className="option-group">
//             {renderOptions(trafficLevels, traffic, setTraffic)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Weather Impact</h3>
//           <div className="option-group">
//             {renderOptions(weatherImpacts, weather, setWeather)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Other Issues</h3>
//           <div className="option-group">
//             {renderOptions(issueTypes, issues, setIssues)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Additional Feedback</h3>
//           <textarea
//             rows="3"
//             placeholder="Describe more details"
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//           ></textarea>
//         </div>

//         <div className="report-actions">
//           <button className="cancel-btn" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="submit-btn" onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






// import React, { useState } from "react";
// import "./Report.css";

// export default function Report({ onClose, vehicle }) {
//   const [text, setText] = useState("");

//   const handleSubmit = () => {
//     if (!text.trim()) {
//       alert("Please describe the issue before submitting.");
//       return;
//     }
//     alert(`Report for ${vehicle}: ${text}`);
//     setText("");
//     onClose();
//   };

//   return (
//     <div className="report-overlay">
//       <div className="report-box">
//         <h2>Report Road Condition</h2>
//         <p>Vehicle: <b>{vehicle}</b></p>

//         <textarea
//           rows="4"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Describe the issue (e.g., potholes, cracks, flooding...)"
//           className="report-textarea"
//         ></textarea>

//         <div className="report-actions">
//           <button className="cancel-btn" onClick={onClose}>Cancel</button>
//           <button className="submit-btn" onClick={handleSubmit}>Submit</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import "./Report.css";

// export default function Report({ onClose, vehicle }) {
//   const [roadCondition, setRoadCondition] = useState("");
//   const [traffic, setTraffic] = useState("");
//   const [weather, setWeather] = useState("");
//   const [feedback, setFeedback] = useState("");

//   const handleSubmit = () => {
//     if (!roadCondition || !traffic || !weather) {
//       alert("Please select all conditions before submitting.");
//       return;
//     }

//     const reportData = {
//       vehicle,
//       roadCondition,
//       traffic,
//       weather,
//       feedback,
//     };

//     console.log("📋 Report Submitted:", reportData);
//     alert(`Report submitted for ${vehicle}`);
//     onClose();
//   };

//   const renderOptions = (options, selected, setSelected) =>
//     options.map((opt) => (
//       <button
//         key={opt}
//         className={`option-btn ${selected === opt ? "selected" : ""}`}
//         onClick={() => setSelected(opt)}
//       >
//         {opt}
//       </button>
//     ));

//   const roadConditions = [
//     "Smooth",
//     "Rough",
//     "Potholes",
//     "Flooded",
//     "Blocked",
//     "Under Construction",
//   ];

//   const trafficLevels = ["Low", "Moderate", "Heavy", "Jammed"];

//   const weatherImpacts = ["Clear", "Rainy", "Foggy", "Stormy"];

//   return (
//     <div className="report-overlay">
//       <div className="report-box">
//         <h2>Report Road Condition</h2>
//         <p>
//           <b>Vehicle:</b> {vehicle}
//         </p>

//         <div className="section">
//           <h3>Overall Road Condition</h3>
//           <div className="option-group">
//             {renderOptions(roadConditions, roadCondition, setRoadCondition)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Traffic Level</h3>
//           <div className="option-group">
//             {renderOptions(trafficLevels, traffic, setTraffic)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Weather Impact</h3>
//           <div className="option-group">
//             {renderOptions(weatherImpacts, weather, setWeather)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Additional Feedback</h3>
//           <textarea
//             rows="3"
//             placeholder="Describe more details"
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//           ></textarea>
//         </div>

//         <div className="report-actions">
//           <button className="cancel-btn" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="submit-btn" onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import "./Report.css";

// export default function Report({ onClose, vehicle }) {
//   const [roadCondition, setRoadCondition] = useState("");
//   const [traffic, setTraffic] = useState("");
//   const [weather, setWeather] = useState("");
//   const [issues, setIssues] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [location, setLocation] = useState("Fetching location...");
//   const [coords, setCoords] = useState({ lat: null, lon: null });

//   // ✅ Fetch user's location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords;
//           setCoords({ lat: latitude, lon: longitude });

//           fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//           )
//             .then((res) => res.json())
//             .then((data) => {
//               if (data.display_name) setLocation(data.display_name);
//               else setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
//             })
//             .catch(() =>
//               setLocation(`Lat: ${latitude}, Lon: ${longitude}`)
//             );
//         },
//         (err) => {
//           console.error(err);
//           setLocation("Location access denied");
//         }
//       );
//     } else {
//       setLocation("Geolocation not supported");
//     }
//   }, []);

//   const handleSubmit = () => {
//     if (!roadCondition || !traffic || !weather) {
//       alert("⚠️ Please select all main conditions before submitting.");
//       return;
//     }

//     const reportData = {
//       vehicle,
//       location,
//       coordinates: coords,
//       roadCondition,
//       traffic,
//       weather,
//       issues,
//       feedback,
//     };

//     console.log("📋 Report Submitted:", reportData);
//     alert(`✅ Report submitted for ${vehicle}`);
//     onClose();
//   };

//   // ✅ Reusable button group renderer
//   const renderOptions = (options, selected, setSelected) =>
//     options.map((opt) => (
//       <button
//         key={opt}
//         className={`option-btn ${selected === opt ? "selected" : ""}`}
//         onClick={() => setSelected(opt)}
//       >
//         {opt}
//       </button>
//     ));

//   const roadConditions = [
//     "Smooth",
//     "Rough",
//     "Potholes",
//     "Flooded",
//     "Blocked",
//     "Under Construction",
//   ];

//   const trafficLevels = ["Low", "Moderate", "Heavy", "Jammed"];

//   const weatherImpacts = ["Clear", "Rainy", "Foggy", "Stormy"];

//   const issueTypes = ["Accident Zone", "Poor Lighting", "No Sign Boards", "Road Blocked"];

//   return (
//     <div className="report-overlay">
//       <div className="report-box">
//         <h2>Report Road Condition</h2>
//         <p>
//           <b>Vehicle:</b> {vehicle}
//         </p>
//         <p className="small-text">
//           <b>Location:</b> {location}
//         </p>

//         <div className="section">
//           <h3>Overall Road Condition</h3>
//           <div className="option-group">
//             {renderOptions(roadConditions, roadCondition, setRoadCondition)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Traffic Level</h3>
//           <div className="option-group">
//             {renderOptions(trafficLevels, traffic, setTraffic)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Weather Impact</h3>
//           <div className="option-group">
//             {renderOptions(weatherImpacts, weather, setWeather)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Other Issues</h3>
//           <div className="option-group">
//             {renderOptions(issueTypes, issues, setIssues)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Additional Feedback</h3>
//           <textarea
//             rows="3"
//             placeholder="Describe more details"
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//           ></textarea>
//         </div>

//         <div className="report-actions">
//           <button className="cancel-btn" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="submit-btn" onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import "./Report.css";

// export default function Report({ onClose, vehicle }) {
//   const [roadCondition, setRoadCondition] = useState("");
//   const [traffic, setTraffic] = useState("");
//   const [weather, setWeather] = useState("");
//   const [issues, setIssues] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [coords, setCoords] = useState({ lat: null, lon: null });

//   // ✅ Fetch user's coordinates
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords;
//           setCoords({ lat: latitude, lon: longitude });
//         },
//         (err) => {
//           console.error(err);
//           setCoords({ lat: "Access Denied", lon: "Access Denied" });
//         }
//       );
//     } else {
//       setCoords({ lat: "Not Supported", lon: "Not Supported" });
//     }
//   }, []);

//   const handleSubmit = () => {
//     if (!roadCondition || !traffic || !weather) {
//       alert("⚠️ Please select all main conditions before submitting.");
//       return;
//     }

//     const reportData = {
//       vehicle,
//       coordinates: coords,
//       roadCondition,
//       traffic,
//       weather,
//       issues,
//       feedback,
//     };

//     console.log("📋 Report Submitted:", reportData);
//     alert(`✅ Report submitted for ${vehicle}`);
//     onClose();
//   };

//   // ✅ Reusable button group
//   const renderOptions = (options, selected, setSelected) =>
//     options.map((opt) => (
//       <button
//         key={opt}
//         type="button" // prevent reload
//         className={`option-btn ${selected === opt ? "selected" : ""}`}
//         onClick={() => setSelected(opt)}
//       >
//         {opt}
//       </button>
//     ));

//   const roadConditions = [
//     "Smooth",
//     "Rough",
//     "Potholes",
//     "Flooded",
//     "Blocked",
//     "Under Construction",
//   ];

//   const trafficLevels = ["Low", "Moderate", "Heavy", "Jammed"];
//   const weatherImpacts = ["Clear", "Rainy", "Foggy", "Stormy"];
//   const issueTypes = ["Accident Zone", "Poor Lighting", "No Sign Boards", "Road Blocked"];

//   return (
//     <div className="report-overlay">
//       <div className="report-box">
//         <h2>Report Road Condition</h2>
//         <p>
//           <b>Vehicle:</b> {vehicle}
//         </p>
//         <p className="small-text">
//           <b>Location:</b>{" "}
//           {coords.lat && coords.lon
//             ? `Latitude: ${coords.lat.toFixed(5)}, Longitude: ${coords.lon.toFixed(5)}`
//             : "Fetching coordinates..."}
//         </p>

//         <div className="section">
//           <h3>Overall Road Condition</h3>
//           <div className="option-group">
//             {renderOptions(roadConditions, roadCondition, setRoadCondition)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Traffic Level</h3>
//           <div className="option-group">
//             {renderOptions(trafficLevels, traffic, setTraffic)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Weather Impact</h3>
//           <div className="option-group">
//             {renderOptions(weatherImpacts, weather, setWeather)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Other Issues</h3>
//           <div className="option-group">
//             {renderOptions(issueTypes, issues, setIssues)}
//           </div>
//         </div>

//         <div className="section">
//           <h3>Additional Feedback</h3>
//           <textarea
//             rows="3"
//             placeholder="Describe more details"
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//           ></textarea>
//         </div>

//         <div className="report-actions">
//           <button className="cancel-btn" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="submit-btn" onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
