require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/user.route.js");
const prohibitedItemRoute = require("./routes/prohibitedItem.route.js");
const orderRoute = require("./routes/order.route.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRoute);
app.use("/prohibitedItems", prohibitedItemRoute);
app.use("/orders", orderRoute);

app.get("/", (req, res) => {
  res.send("Hello from Cross Connect API Server!!!");
});

const connectDb = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@db.6q7tt.mongodb.net/crossConnect?retryWrites=true&w=majority&appName=DB`
    );
    console.log("Connected to database!");
  } catch (error) {
    console.log("Connection failed!", error);
  }
};

const startServer = () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

connectDb().then(startServer);
