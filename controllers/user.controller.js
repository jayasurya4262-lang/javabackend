const express = require("express")
const userService = require("../services/user.service")
const router = express.Router()

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  const response = await userService.authenticateUser(username, password)

  if (response.success) {
    return res.status(200).json(response)
  } else {
    return res.status(401).json(response)
  }
})

router.post("/register", async (req, res) => {
  const user = req.body
  try {
    const savedUser = await userService.registerUser(user)
    if (savedUser) {
      return res.status(200).json(savedUser)
    }
    return res.status(400).send("Username or email already exists.")
  } catch (error) {
    console.error("Error registering user:", error)
    return res.status(500).send("Internal Server Error")
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
  const user = await userService.getUserById(id)
  if (user) {
    return res.status(200).json(user)
  }
  return res.status(404).send("User not found")
})

module.exports = router
