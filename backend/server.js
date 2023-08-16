const express = require("express");
const app = express();
const port = 4000;
const path = require("path");
const env = process.env.NODE_ENV || "development";
const session = require("express-session");
if (env === "development") {
  require("dotenv").config();
}
// const cors = require("cors");

require("dotenv").config();

const authRouter = require("./routes/auth");
const restaurantRouter = require("./routes/restaurant");
const {
  forbiddenErrorHandler,
  notFoundErrorHandler,
} = require("./middleware/errorHandlers");

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"]
  })
);

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
});

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hour
    },
  })
);

app.use(forbiddenErrorHandler);
app.use(notFoundErrorHandler);

// routes
app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
