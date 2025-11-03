import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App(){
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [view, setView] = useState(token ? "dashboard" : "login");
  function onLogin(t){ localStorage.setItem("token", t); setToken(t); setView("dashboard"); }
  function onLogout(){ localStorage.removeItem("token"); setToken(null); setView("login"); }
  return (
    <div className="app">
      <header><h1>Road Speed Finder</h1></header>
      <main>
        {view==="register" && <Register onRegistered={()=>setView("login")} />}
        {view==="login" && <Login onLogin={onLogin} onShowRegister={()=>setView("register")} />}
        {view==="dashboard" && <Dashboard token={token} onLogout={onLogout} />}
      </main>
      <footer>DBMS Project : H4 Group</footer>
    </div>
  );
}