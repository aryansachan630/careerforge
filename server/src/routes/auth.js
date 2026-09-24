import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const memoryUsers = [];

function tokenFor(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "careerforge-dev-secret", { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required." });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

  try {
    if (User.db.readyState === 1) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(409).json({ message: "Email already registered." });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email: email.toLowerCase(), password: hash });
      return res.status(201).json({ token: tokenFor(user._id.toString()), user: { name: user.name, email: user.email } });
    }

    if (memoryUsers.some(u => u.email === email.toLowerCase())) return res.status(409).json({ message: "Email already registered." });
    const user = { id: crypto.randomUUID(), name, email: email.toLowerCase(), password: await bcrypt.hash(password, 10) };
    memoryUsers.push(user);
    res.status(201).json({ token: tokenFor(user.id), user: { name, email: user.email } });
  } catch (e) {
    res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (User.db.readyState === 1) {
      const user = await User.findOne({ email: email?.toLowerCase() });
      if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password." });
      return res.json({ token: tokenFor(user._id.toString()), user: { name: user.name, email: user.email } });
    }

    const user = memoryUsers.find(u => u.email === email?.toLowerCase());
    if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password." });
    res.json({ token: tokenFor(user.id), user: { name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ message: "Login failed." });
  }
});

export default router;
