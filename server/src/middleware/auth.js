import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Authentication required." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "careerforge-dev-secret");
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
