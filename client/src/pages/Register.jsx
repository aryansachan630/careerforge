import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import api from "../services/api";

export default function Register({ onAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try { const { data } = await api.post("/auth/register", form); onAuth(data); }
    catch (e) { setError(e.response?.data?.message || "Unable to create account."); }
    finally { setLoading(false); }
  }

  return <main className="auth-page"><section className="auth-brand"><div className="brand"><span className="brand-mark">CF</span>CareerForge</div><div className="brand-copy"><span className="eyebrow">BUILD YOUR PIPELINE</span><h1>Every application has a <em>next step.</em></h1><p>Keep your search focused, measurable and ready for action.</p></div></section><section className="auth-card"><span className="eyebrow">GET STARTED</span><h2>Create your account</h2><p className="muted">Set up your private career workspace in seconds.</p><form onSubmit={submit} className="auth-form">
    {error && <div className="error">{error}</div>}
    <label>Full name<div className="input-wrap"><User size={18}/><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Aryan Sachan"/></div></label>
    <label>Email<div className="input-wrap"><Mail size={18}/><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></div></label>
    <label>Password<div className="input-wrap"><Lock size={18}/><input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 6 characters"/></div></label>
    <button className="primary-btn" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
    <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
  </form></section></main>;
}
