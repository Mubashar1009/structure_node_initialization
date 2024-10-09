const express = require('express');
const {signup,login} = require("../controllers/signup");
// const {login} = require("../controllers/login");
const {checkUsername} = require("../middleware/checkUsername");
const app = express();
const router = express.Router();

app.use(checkUsername);
// router.route("/").get(signup);
router.route("/user").post(signup);
router.route("/login").post(login);
// router.route("/user/:id").get(login);
// router.get("/",checkUsername,(req,res)=>{
//     res.send("Hello World!");
// })

module.exports = router;