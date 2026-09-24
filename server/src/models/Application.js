import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: "Remote" },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Applied"
    },
    appliedDate: { type: Date, default: Date.now },
    interviewDate: Date,
    notes: { type: String, default: "" },
    salary: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
