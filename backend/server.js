const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 8000;

connectDB();

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/schools", require("./routes/schoolRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use('/api/payments', paymentRoutes);

// Bull Board setup (added)
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const paymentQueue = require('./services/PaymentQueue');

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullAdapter(paymentQueue)],
  serverAdapter
});
app.use('/admin/queues', serverAdapter.getRouter());
// End Bull Board

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) =>
    res.send("Please set NODE_ENV to production in .env")
  );
}
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
