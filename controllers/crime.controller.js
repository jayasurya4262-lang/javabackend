const express = require("express")
const crimeService = require("../services/crime.service")
const router = express.Router()

router.post("/", async (req, res) => {
  const crime = req.body
  console.log("Received crime for creation:", crime.crimeType, "at", crime.location)
  if (crime.images && crime.images.length > 0) {
    console.log("Received", crime.images.length, "images (Base64 strings).")
  }

  // Set server-side properties that are not sent from client or need to be set on creation
  crime.dateTime = new Date() // Equivalent to LocalDateTime.now()
  crime.status = "REPORTED"
  crime.criminalStatus = "UNKNOWN" // Set default criminal status on creation

  // Handle Serial Killer specific properties based on crimeType
  if ("Serial Killer".equalsIgnoreCase(crime.crimeType)) {
    crime.priority = "HIGH"
    crime.alertLevel = "CRITICAL"
    crime.specialUnit = "Criminal Investigation Department"
    crime.requiresImmediateAttention = true
  } else {
    crime.priority = "MEDIUM"
    crime.alertLevel = "NORMAL"
    crime.requiresImmediateAttention = false
  }

  try {
    const savedCrime = await crimeService.saveCrime(crime)
    console.log("Crime saved successfully with ID:", savedCrime._id)
    return res.status(200).json(savedCrime)
  } catch (e) {
    console.error("Error saving crime:", e.message)
    console.error(e.stack) // Print full stack trace for detailed error
    return res.status(500).send("Internal Server Error")
  }
})

router.get("/", async (req, res) => {
  const crimes = await crimeService.getAllCrimes()
  return res.status(200).json(crimes)
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
  const crime = await crimeService.getCrimeById(id)
  if (crime) {
    return res.status(200).json(crime)
  }
  return res.status(404).send("Crime not found")
})

router.get("/type/:crimeType", async (req, res) => {
  const { crimeType } = req.params
  const crimes = await crimeService.getCrimesByType(crimeType)
  return res.status(200).json(crimes)
})

router.get("/location/:location", async (req, res) => {
  const { location } = req.params
  const crimes = await crimeService.getCrimesByLocation(location)
  return res.status(200).json(crimes)
})

router.get("/search", async (req, res) => {
  const { query } = req.query
  const crimes = await crimeService.searchCrimes(query)
  return res.status(200).json(crimes)
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const crimeData = req.body
  console.log(
    "Received crime for update (ID:",
    id + "):",
    crimeData.crimeType,
    "Status:",
    crimeData.status,
    "Criminal Status:",
    crimeData.criminalStatus,
  )

  const existingCrime = await crimeService.getCrimeById(id)
  if (existingCrime) {
    crimeData.id = id // Ensure the ID is set for update
    const updatedCrime = await crimeService.saveCrime(crimeData) // saveCrime handles update if ID is present
    console.log("Crime updated successfully with ID:", updatedCrime._id)
    return res.status(200).json(updatedCrime)
  }
  console.error("Crime with ID", id, "not found for update.")
  return res.status(404).send("Crime not found for update")
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  await crimeService.deleteCrime(id)
  return res.status(204).send() // No Content
})

module.exports = router
