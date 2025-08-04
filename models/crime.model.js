const mongoose = require("mongoose")

const crimeSchema = new mongoose.Schema({
  crimeType: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  dateTime: { type: Date, default: Date.now },
  status: { type: String, default: "REPORTED" }, // e.g., REPORTED, UNDER_INVESTIGATION, CRIMINAL_ARRESTED, CLOSED
  suspects: [{ type: String }],
  reportedBy: { type: String, required: true },
  images: [{ type: String }], // Stores Base64 strings
  priority: { type: String, default: "MEDIUM" },
  alertLevel: { type: String, default: "NORMAL" },
  specialUnit: { type: String },
  requiresImmediateAttention: { type: Boolean, default: false },
  criminalStatus: { type: String, default: "UNKNOWN" }, // e.g., UNKNOWN, ALIVE, DECEASED
})

module.exports = mongoose.model("Crime", crimeSchema)
