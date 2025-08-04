const mongoose = require("mongoose")
const User = require("../models/user.model") // Adjust path if necessary
require("dotenv").config() // For local testing with .env, though Render uses direct env vars

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/mydb" // Fallback for local testing

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URL)
    console.log("MongoDB connected for seeding.")

    const defaultUser = {
      username: "admin",
      password: "password123", // Use a strong password in production!
      role: "ADMIN",
      email: "admin@example.com",
      phoneNumber: "123-456-7890",
      isActive: true,
    }

    const existingUser = await User.findOne({ username: defaultUser.username })

    if (existingUser) {
      console.log(`User '${defaultUser.username}' already exists. Skipping creation.`)
    } else {
      const newUser = new User(defaultUser)
      await newUser.save()
      console.log(`User '${defaultUser.username}' created successfully!`)
    }
  } catch (error) {
    console.error("Error seeding users:", error)
  } finally {
    await mongoose.disconnect()
    console.log("MongoDB disconnected.")
  }
}

seedUsers()
