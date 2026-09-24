import { X } from "lucide-react";
export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal"><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>{children}</div></div>;
}
