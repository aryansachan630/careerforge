import { useEffect, useState } from "react";
import Modal from "./Modal";

const empty = { company:"", role:"", location:"Remote", status:"Applied", appliedDate:new Date().toISOString().slice(0,10), interviewDate:"", salary:"", notes:"" };

export default function ApplicationModal({ open, onClose, onSave, initial }) {
  const [form,setForm]=useState(empty);
  useEffect(()=>setForm(initial ? {...initial, appliedDate: initial.appliedDate?.slice(0,10)||"", interviewDate: initial.interviewDate?.slice(0,10)||""} : empty),[initial,open]);
  const set=(k,v)=>setForm({...form,[k]:v});
  return <Modal open={open} title={initial ? "Edit application" : "Add application"} onClose={onClose}>
    <form className="modal-form" onSubmit={e=>{e.preventDefault();onSave(form)}}>
      <div className="two-col"><label>Company<input required value={form.company} onChange={e=>set("company",e.target.value)} placeholder="Google"/></label><label>Role<input required value={form.role} onChange={e=>set("role",e.target.value)} placeholder="Software Engineer"/></label></div>
      <div className="two-col"><label>Location<input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="Bengaluru / Remote"/></label><label>Salary<input value={form.salary} onChange={e=>set("salary",e.target.value)} placeholder="₹12 LPA"/></label></div>
      <div className="two-col"><label>Status<select value={form.status} onChange={e=>set("status",e.target.value)}>{["Applied","Shortlisted","Interview","Selected","Rejected"].map(x=><option key={x}>{x}</option>)}</select></label><label>Applied date<input type="date" value={form.appliedDate} onChange={e=>set("appliedDate",e.target.value)}/></label></div>
      <label>Interview date<input type="date" value={form.interviewDate} onChange={e=>set("interviewDate",e.target.value)}/></label>
      <label>Notes<textarea rows="4" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Interview round, recruiter contact, preparation notes..."/></label>
      <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn">{initial ? "Save changes" : "Add application"}</button></div>
    </form>
  </Modal>;
}
