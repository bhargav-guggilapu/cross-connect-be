require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const ChatMessage = require("./models/chatMessage.model.js");

const userRoute = require("./routes/user.route.js");
const prohibitedItemRoute = require("./routes/prohibitedItem.route.js");
const orderRoute = require("./routes/order.route.js");

const Order = require("./models/order.model.js");
const { IN_PROGRESS_STATUS } = require("./constants.js");
const User = require("./models/user.model.js");

const fetchExchangeRate = async () => {
  const response = await fetch("https://open.er-api.com/v6/latest/USD");
  const result = await response.json();
  return result.rates["INR"];
};

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const message = {
    from: {
      name: "Cross Connect",
      address: process.env.EMAIL,
    },
    to,
    subject,
    html,
  };

  transporter
    .sendMail(message)
    .then((info) => {
      console.log("Email sent successfully to: " + info.accepted[0]);
    })
    .catch((error) => {
      console.log(error);
    });
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});
const onlineUsers = {};
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRoute);
app.use("/prohibitedItems", prohibitedItemRoute);
app.use("/orders", orderRoute);

app.get("/", (req, res) => {
  res.send("Hello from Cross Connect API Server!!!");
});

app.post("/create-payment-intent", async (req, res) => {
  const { orderId, tipAmount } = req.body;

  const order = await Order.find({ _id: orderId });

  if (order.length === 0) {
    return res.status(404).json({
      message: `Order not found`,
    });
  }

  const exchangeRate = await fetchExchangeRate();
  const inProgressStatus = order[0].inProgressStatus;
  let amount = 0;

  if (inProgressStatus === IN_PROGRESS_STATUS.COST_ESTIMATE) {
    amount = Math.round((order[0].itemsCost / exchangeRate) * 100 * 1.1);
  }

  if (inProgressStatus === IN_PROGRESS_STATUS.SHIPPING_ESTIMATE) {
    amount = Math.round((order[0].shippingCost / exchangeRate) * 100);
  }

  if (inProgressStatus === IN_PROGRESS_STATUS.SHIPPED) {
    amount = Math.round((tipAmount / exchangeRate) * 100);
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/cancel-payment-intent", async (req, res) => {
  const { id } = req.body;

  try {
    await stripe.paymentIntents.cancel(id);

    res.json({ message: "Canceled Payment" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    await sendEmail(to, subject, html);

    res.json({ message: "Email Sent Successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  onlineUsers[userId] = {
    isOnline: true,
    lastSeen: new Date(),
  };
  io.emit("updateUserStatus", onlineUsers);

  socket.on("joinRoom", async ({ customerId, agentId }) => {
    const roomId = `${customerId}_${agentId}`;
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    const chatHistory = await ChatMessage.find({ roomId }).sort({
      timestamp: 1,
    });
    io.to(socket.id).emit("chatHistory", chatHistory);
  });

  socket.on(
    "sendMessage",
    async ({ customerId, agentId, senderId, message }) => {
      const roomId = `${customerId}_${agentId}`;
      const newMessage = new ChatMessage({ roomId, senderId, message });

      await newMessage.save();

      const senderData = await User.find({ _id: senderId });
      let receiverData;
      if (senderId == agentId) {
        receiverData = await User.find({ _id: customerId });
      } else if (senderId == customerId) {
        receiverData = await User.find({ _id: agentId });
      }

      if (senderData.length === 0) {
        return res.status(404).json({
          message: `Sender not found`,
        });
      }

      if (receiverData.length === 0) {
        return res.status(404).json({
          message: `Receiver not found`,
        });
      }

      if (!onlineUsers[receiverData[0]._id]?.isOnline) {
        await sendEmail(
          receiverData[0].email,
          "New Message Notification",
          `
              <h3>Dear ${receiverData[0].firstName},</h3>
              <p>You have received a new message from <b>${senderData[0].firstName} ${senderData[0].lastName}</b> while you were offline.</p>
              <p>Here’s what they said:</p>
              <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                  ${message}
              </blockquote>
              <p>To reply, please log in to your account.</p>
              <p>Thank you,<br>Cross Connect</p>
          `
        );
      }

      io.to(roomId).emit("receiveMessage", newMessage);
    }
  );

  socket.on("disconnectUser", () => {
    onlineUsers[userId] = {
      isOnline: false,
      lastSeen: new Date(),
    };
    io.emit("updateUserStatus", onlineUsers);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    onlineUsers[userId] = {
      isOnline: false,
      lastSeen: new Date(),
    };
    io.emit("updateUserStatus", onlineUsers);
  });
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
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

connectDb().then(startServer);
