const User = require("../models/user.model")

const userService = {
  authenticateUser: async (username, password) => {
    const response = {}
    const user = await User.findOne({ username })
    console.log("User found in DB:", user ? user.username : "None")
    console.log("Password match:", user && user.password === password)

    if (user && user.password === password) {
      response.success = true
      response.user = user
      response.role = user.role
    } else {
      response.success = false
      response.message = "Invalid credentials"
    }
    return response
  },

  registerUser: async (userData) => {
    const existingUserByUsername = await User.exists({ username: userData.username })
    const existingUserByEmail = await User.exists({ email: userData.email })

    if (!existingUserByUsername && !existingUserByEmail) {
      const newUser = new User(userData)
      return newUser.save()
    }
    return null
  },

  getUserById: async (id) => {
    return User.findById(id)
  },
}

module.exports = userService
