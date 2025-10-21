const express = require("express");

const connectDB = require("./config/db");

const stringRoutes = require("./routes/stringRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
connectDB();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on: localhost:${PORT}`);
});

// Routes
app.use("/strings", stringRoutes);

app.use(notFound);
app.use(errorHandler);
