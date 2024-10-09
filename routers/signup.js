const express = require('express');
const {signup} = require("../controllers/signup");
const {login} = require("../controllers/login");
const {checkUsername} = require("../middleware/checkUsername");
const app = express();
const router = express.Router();

app.use(checkUsername);
// router.route("/").get(signup);
router.route("/user").post(signup);
router.route("/user/:id").get(login);
// router.get("/",checkUsername,(req,res)=>{
//     res.send("Hello World!");
// })

module.exports = router;