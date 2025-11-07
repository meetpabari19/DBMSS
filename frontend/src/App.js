import React, { useState ,useEffect} from "react";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App(){
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [view, setView] = useState(token ? "dashboard" : "login");
    useEffect(() => {
    if (window.location.pathname === "/admin") {
      setView("admin");
    }
  }, []);
  function onLogin(t){ localStorage.setItem("token", t); setToken(t); setView("dashboard"); }
  function onLogout(){ localStorage.removeItem("token"); setToken(null); setView("login"); }
  return (
    <div className="app">
      <header><h1>Road Speed Finder</h1></header>
      <main>
        {view==="register" && <Register onRegistered={()=>setView("login")} />}
        {view==="login" && <Login onLogin={onLogin} onShowRegister={()=>setView("register")} />}
        {view==="dashboard" && <Dashboard token={token} onLogout={onLogout} />}
        {view === "admin" && <AdminDashboard />}
      </main>
      <footer></footer>
    </div>
  );
}