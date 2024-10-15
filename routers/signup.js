const express = require('express');
const {signup,login} = require("../controllers/signup");
const {forgotPassword} = require("../controllers/forgotPassword");
// const {login} = require("../controllers/login");
const {checkUsername} = require("../middleware/checkUsername");
const { protectRoute, deletePermission } = require('../controllers/authentication');
const app = express();
const router = express.Router();


// router.use(protectRoute); // Protect routes with JWT authentication
app.use(checkUsername);
// router.route("/").get(signup);
router.route("/user").post(protectRoute,deletePermission('admin','manager'),signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
// router.route("/user/:id").get(login);
// router.get("/",checkUsername,(req,res)=>{
//     res.send("Hello World!");
// })

module.exports = router;