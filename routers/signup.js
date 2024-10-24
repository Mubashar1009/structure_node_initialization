const express = require('express');
const {signup,login} = require("../controllers/signup");
const {forgotPassword} = require("../controllers/forgotPassword");
const {resetPassword} = require("../controllers/resetPassword");
// const {login} = require("../controllers/login");
const {checkUsername} = require("../middleware/checkUsername");
const { protectRoute, deletePermission } = require('../controllers/authentication');
const { updatePassword,updateMe,deleteMe } = require('../controllers/updatePassword');
const app = express();
const router = express.Router();


// router.use(protectRoute); // Protect routes with JWT authentication
app.use(checkUsername);
// router.route("/").get(signup);
router.route("/user").post(signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updatePassword").patch(protectRoute,updatePassword);
router.route("/updateMe").patch(protectRoute,updateMe);
router.route("/deleteMe").delete(protectRoute,deleteMe);
// router.route("/user/:id").get(login);
// router.get("/",checkUsername,(req,res)=>{
//     res.send("Hello World!");
// })

module.exports = router;