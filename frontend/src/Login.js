import React, { useState } from "react";
export default function Login({ onLogin, onShowRegister }){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState("");
  async function submit(e){ e.preventDefault(); setMsg("Logging in..."); try{
    const res = await fetch("http://localhost:4000/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    onLogin(data.token);
  }catch(err){ setMsg("Error: "+err.message); } }
  return (<div className="card"><h2>Login</h2><form onSubmit={submit}><input required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /><button type="submit">Login</button></form><p className="muted">Don't have account? <a href="#" onClick={e=>{e.preventDefault(); onShowRegister();}}>Register</a></p><p className="msg">{msg}</p></div>);
}