const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const userRoutes = require("./controllers/user.controller")
const crimeRoutes = require("./controllers/crime.controller")

const app = express()
const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL // Ensure this environment variable is set on Render

// Middleware
app.use(cors()) // Enable CORS for all origins, similar to @CrossOrigin(origins = "*")
app.use(express.json({ limit: "50mb" })) // To parse JSON bodies, increased limit for Base64 images

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1) // Exit process with failure
  })

// Routes
app.use("/api/users", userRoutes)
app.use("/api/crimes", crimeRoutes)

// Basic route for health check
app.get("/", (req, res) => {
  res.send("Crime Management Backend is running!")
})

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
