const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./routers/signup");
const globalError  = require("./controllers/globalError");
const { checkUsername } = require("./middleware/checkUsername");
const appError = require("./utils/appError");

dotenv.config({ path: "./config.env" });

const app = express();

try {
  mongoose.connect(process.env.MONGODB_URL, {});
  console.log("MongoDB Connected...");
} catch (errors) {
  console.error("Error connecting to MongoDB", errors);
  process.exit(1);
}
const port = process.env.PORT || 4000;

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// router.route("/").get((req,res)=>{
//   res.send("Hello World!");
// });
// app.use("/",checkUsername,router);
app.use("/", router);
// app.get("/", (req, res) =>{
//     res.send("Hello World!");
// })
app.all("*", (req, res, next) => {
 next(new appError("Page not found!",404));
});
app.use(globalError);
const server = app.listen(port, () => {
  console.log("listening on port " + port);
});

process.on("unhandledRejection", (error) => {
  server.close(() => {
    console.error("Error: Shutting down due to unhandled rejection", error);
    process.exit(1);
  });
});

process.on("uncaughtException", (error) => {
  server.close(() => {
    console.error("Error: Shutting down due to uncaught exception", error);
    process.exit(1);
  });
});
