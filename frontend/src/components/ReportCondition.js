import React, { useState } from "react";
import "./ReportCondition.css";

export default function ReportCondition({ username, location, roadType, onClose }) {
  const [formData, setFormData] = useState({
    username: username || "",
    location: location || "",
    roadType: roadType || "",
    roadCondition: "",
    trafficLevel: "",
    weather: "",
    rating: 3,
    feedback: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
const res = await fetch("http://localhost:4000/api/feedback/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});


      if (res.ok) {
        alert("✅ Feedback submitted successfully!");
        onClose();
      } else {
        const errText = await res.text();
        console.error("Server error:", errText);
        alert("❌ Failed to submit feedback!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Error submitting feedback!");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>Report Road Condition</h2>

        <label>Road Condition</label>
        <select name="roadCondition" onChange={handleChange}>
          <option value="">Select...</option>
          <option value="Smooth">Smooth</option>
          <option value="Moderate">Moderate</option>
          <option value="Rough">Rough</option>
          <option value="Damaged">Damaged</option>
          <option value="Potholes">Potholes</option>
        </select>

        <label>Traffic Level</label>
        <select name="trafficLevel" onChange={handleChange}>
          <option value="">Select...</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label>Weather</label>
        <select name="weather" onChange={handleChange}>
          <option value="">Select...</option>
          <option value="Clear">Clear</option>
          <option value="Rainy">Rainy</option>
          <option value="Foggy">Foggy</option>
        </select>

        <label>Rate the Road (1–5)</label>
        <input
          type="range"
          min="1"
          max="5"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />
        <span>{formData.rating}⭐</span>

        <label>Additional Feedback</label>
        <textarea
          name="feedback"
          placeholder="Share your experience..."
          onChange={handleChange}
        />

        <div className="dialog-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
