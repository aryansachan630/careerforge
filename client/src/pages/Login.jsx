import { useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Lock, Mail } from "lucide-react";
import api from "../services/api";

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try { const { data } = await api.post("/auth/login", form); onAuth(data); }
    catch (e) { setError(e.response?.data?.message || "Unable to login."); }
    finally { setLoading(false); }
  }

  return <AuthShell title="Welcome back" subtitle="Track every opportunity. Stay interview-ready.">
    <form onSubmit={submit} className="auth-form">
      {error && <div className="error">{error}</div>}
      <label>Email<div className="input-wrap"><Mail size={18}/><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></div></label>
      <label>Password<div className="input-wrap"><Lock size={18}/><input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/></div></label>
      <button className="primary-btn" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
    </form>
  </AuthShell>;
}

function AuthShell({ title, subtitle, children }) {
  return <main className="auth-page"><section className="auth-brand"><div className="brand"><span className="brand-mark"><BriefcaseBusiness size={21}/></span>CareerForge</div><div className="brand-copy"><span className="eyebrow">YOUR CAREER, ORGANIZED</span><h1>Turn applications into <em>opportunities.</em></h1><p>One calm workspace for jobs, interviews and your next big move.</p></div></section><section className="auth-card"><div><span className="eyebrow">CAREERFORGE</span><h2>{title}</h2><p className="muted">{subtitle}</p></div>{children}</section></main>;
}
