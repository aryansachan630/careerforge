import express from "express";
import Application from "../models/Application.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const memoryApps = [];

const getApps = async (userId) => {
  if (Application.db.readyState === 1) return Application.find({ userId }).sort({ createdAt: -1 });
  return memoryApps.filter(a => a.userId === userId).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
};

router.use(protect);

router.get("/", async (req, res) => {
  try { res.json(await getApps(req.userId)); }
  catch { res.status(500).json({ message: "Could not load applications." }); }
});

router.post("/", async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.userId };
    if (!payload.company || !payload.role) return res.status(400).json({ message: "Company and role are required." });
    if (Application.db.readyState === 1) return res.status(201).json(await Application.create(payload));
    const app = { _id: crypto.randomUUID(), ...payload, createdAt: new Date().toISOString() };
    memoryApps.push(app);
    res.status(201).json(app);
  } catch { res.status(500).json({ message: "Could not create application." }); }
});

router.put("/:id", async (req, res) => {
  try {
    if (Application.db.readyState === 1) {
      const updated = await Application.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Application not found." });
      return res.json(updated);
    }
    const app = memoryApps.find(a => a._id === req.params.id && a.userId === req.userId);
    if (!app) return res.status(404).json({ message: "Application not found." });
    Object.assign(app, req.body);
    res.json(app);
  } catch { res.status(500).json({ message: "Could not update application." }); }
});

router.delete("/:id", async (req, res) => {
  try {
    if (Application.db.readyState === 1) {
      const deleted = await Application.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      if (!deleted) return res.status(404).json({ message: "Application not found." });
      return res.json({ message: "Deleted." });
    }
    const index = memoryApps.findIndex(a => a._id === req.params.id && a.userId === req.userId);
    if (index < 0) return res.status(404).json({ message: "Application not found." });
    memoryApps.splice(index, 1);
    res.json({ message: "Deleted." });
  } catch { res.status(500).json({ message: "Could not delete application." }); }
});

export default router;
