const Crime = require("../models/crime.model")

const crimeService = {
  saveCrime: async (crimeData) => {
    if (crimeData._id) {
      // Mongoose uses _id, not id for existing documents
      // If _id exists, it's an update operation
      return Crime.findByIdAndUpdate(crimeData._id, crimeData, { new: true })
    } else {
      // Otherwise, it's a new crime
      const newCrime = new Crime(crimeData)
      return newCrime.save()
    }
  },

  getAllCrimes: async () => {
    return Crime.find()
  },

  getCrimeById: async (id) => {
    return Crime.findById(id)
  },

  getCrimesByType: async (crimeType) => {
    return Crime.find({ crimeType: { $regex: crimeType, $options: "i" } })
  },

  getCrimesByLocation: async (location) => {
    return Crime.find({ location: { $regex: location, $options: "i" } })
  },

  searchCrimes: async (query) => {
    const crimesByType = await Crime.find({ crimeType: { $regex: query, $options: "i" } })
    const crimesByLocation = await Crime.find({ location: { $regex: query, $options: "i" } })
    const crimesByDescription = await Crime.find({ description: { $regex: query, $options: "i" } })

    // Combine and remove duplicates
    const combinedResults = [...crimesByType, ...crimesByLocation, ...crimesByDescription]
    const uniqueResults = Array.from(new Map(combinedResults.map((item) => [item["_id"].toString(), item])).values())
    return uniqueResults
  },

  deleteCrime: async (id) => {
    return Crime.findByIdAndDelete(id)
  },
}

module.exports = crimeService
