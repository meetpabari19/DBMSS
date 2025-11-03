import React, { useState } from "react";
export default function Register({ onRegistered }){
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState("");
  async function submit(e){ e.preventDefault(); setMsg("Registering..."); try{
    const res = await fetch("http://localhost:4000/api/auth/register",
       { method:"POST", 
         headers:{"Content-Type":"application/json"}, 
         body: JSON.stringify({ name, email, password }) }
      );
    const data = await res.json();

    if (!res.ok) 
      throw new Error(data.error || "Register failed");

    setMsg("Registered. Login now."); setTimeout(()=> onRegistered(),600);

  }catch(err)
  { setMsg("Error: "+err.message); } 
}
  return (
  <div className="card">
    <h2>Register</h2>
    <form onSubmit={submit}>
      <input required placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
    <p className="msg">{msg}</p>
    </div>
    );
}