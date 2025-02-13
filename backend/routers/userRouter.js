const express = require("express")
const router = express.Router()
const {registerUser, loginUser, allUser, countUsers, changePassword, toggleUserStatus} = require("../controls/userControl")

router.post("/registration", registerUser)
router.post("/login", loginUser)
router.get("/all-users", allUser)
router.get("/users-total", countUsers)
router.get("/change-password", changePassword)
router.put("/toggle-user/:id", toggleUserStatus);


module.exports = router;