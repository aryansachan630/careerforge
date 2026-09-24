import { useEffect, useMemo, useState } from "react";
import { Plus, Search, LogOut, BriefcaseBusiness, Clock3, CheckCircle2, XCircle, CalendarDays, MoreHorizontal, MapPin, Pencil, Trash2 } from "lucide-react";
import api from "../services/api";
import ApplicationModal from "../components/ApplicationModal";

const statuses=["Applied","Shortlisted","Interview","Selected","Rejected"];

export default function Dashboard({ user, onLogout }) {
  const [apps,setApps]=useState([]); const [search,setSearch]=useState(""); const [filter,setFilter]=useState("All");
  const [modal,setModal]=useState(false); const [editing,setEditing]=useState(null); const [menu,setMenu]=useState(null); const [error,setError]=useState("");

  async function load(){ try { const {data}=await api.get("/applications"); setApps(data); } catch(e){setError(e.response?.data?.message||"Could not load applications.");} }
  useEffect(()=>{load()},[]);

  const filtered=useMemo(()=>apps.filter(a=>(filter==="All"||a.status===filter)&&`${a.company} ${a.role} ${a.location}`.toLowerCase().includes(search.toLowerCase())),[apps,filter,search]);
  const count=s=>apps.filter(a=>a.status===s).length;
  const interviewCount=apps.filter(a=>a.interviewDate && new Date(a.interviewDate)>=new Date()).length;

  async function save(form){
    try{
      if(editing){ const {data}=await api.put(`/applications/${editing._id}`,form); setApps(apps.map(a=>a._id===editing._id?data:a));}
      else {const {data}=await api.post("/applications",form);setApps([data,...apps]);}
      setModal(false);setEditing(null);
    }catch(e){setError(e.response?.data?.message||"Could not save application.");}
  }
  async function remove(id){
    if(!confirm("Delete this application?"))return;
    try{await api.delete(`/applications/${id}`);setApps(apps.filter(a=>a._id!==id));setMenu(null)}catch(e){setError("Could not delete application.")}
  }

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark"><BriefcaseBusiness size={19}/></span>CareerForge</div><nav><div className="nav-item active"><BriefcaseBusiness size={18}/> Applications</div><div className="nav-item"><CalendarDays size={18}/> Interviews <span className="nav-count">{interviewCount}</span></div></nav><div className="sidebar-bottom"><div className="profile"><div className="avatar">{(user?.name||"U").slice(0,1).toUpperCase()}</div><div><strong>{user?.name||"User"}</strong><span>{user?.email}</span></div></div><button className="logout" onClick={onLogout}><LogOut size={17}/> Sign out</button></div></aside>
    <main className="main">
      <header className="topbar"><div><span className="eyebrow">OVERVIEW</span><h1>Good morning, {user?.name?.split(" ")[0] || "there"}.</h1><p>Keep your job search moving forward.</p></div><button className="primary-btn add-btn" onClick={()=>{setEditing(null);setModal(true)}}><Plus size={18}/> Add application</button></header>
      {error&&<div className="error banner">{error}</div>}
      <section className="stats"><Stat icon={<BriefcaseBusiness/>} label="Total applications" value={apps.length}/><Stat icon={<Clock3/>} label="In progress" value={count("Applied")+count("Shortlisted")+count("Interview")}/><Stat icon={<CheckCircle2/>} label="Selected" value={count("Selected")}/><Stat icon={<CalendarDays/>} label="Upcoming interviews" value={interviewCount}/></section>
      <section className="panel"><div className="panel-head"><div><h2>Application pipeline</h2><p>{filtered.length} application{filtered.length!==1?"s":""} showing</p></div><div className="controls"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company or role"/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></div></div>
        <div className="table-wrap"><table><thead><tr><th>Company / Role</th><th>Status</th><th>Location</th><th>Applied</th><th>Interview</th><th></th></tr></thead><tbody>
        {filtered.length===0?<tr><td colSpan="6"><div className="empty"><BriefcaseBusiness size={32}/><h3>No applications yet</h3><p>Add your first application to start building your pipeline.</p><button className="secondary-btn" onClick={()=>setModal(true)}><Plus size={16}/> Add application</button></div></td></tr>:filtered.map(a=><tr key={a._id}><td><div className="company-cell"><div className="company-logo">{a.company.slice(0,1).toUpperCase()}</div><div><strong>{a.company}</strong><span>{a.role}</span></div></div></td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td><td><span className="muted-cell"><MapPin size={14}/>{a.location||"Remote"}</span></td><td>{a.appliedDate?new Date(a.appliedDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—"}</td><td>{a.interviewDate?new Date(a.interviewDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}):"—"}</td><td className="actions"><button className="icon-btn" onClick={()=>setMenu(menu===a._id?null:a._id)}><MoreHorizontal size={18}/></button>{menu===a._id&&<div className="row-menu"><button onClick={()=>{setEditing(a);setModal(true);setMenu(null)}}><Pencil size={15}/> Edit</button><button className="danger-text" onClick={()=>remove(a._id)}><Trash2 size={15}/> Delete</button></div>}</td></tr>)}
        </tbody></table></div>
      </section>
    </main>
    <ApplicationModal open={modal} initial={editing} onClose={()=>{setModal(false);setEditing(null)}} onSave={save}/>
  </div>;
}

function Stat({icon,label,value}){return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>}
