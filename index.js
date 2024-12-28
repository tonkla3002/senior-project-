const express = require("express");
const cors = require("cors");
const dataRouter = require("./routes/data");
const userRouter = require("./routes/user");
const detailRouter = require("./routes/detail")
// const searchRouter = require("./routes/search")

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Replaces body-parser, as it's included in Express

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Hee Pin!");
});

app.use("/data", dataRouter);
app.use("/user", userRouter);
app.use("/detail", detailRouter);
// app.use("/search", searchRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
