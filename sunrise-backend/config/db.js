const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

/**
 * Connects to MongoDB Atlas.
 * Exits the process immediately on failure — there is no point
 * running the server without a database.
 */
const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These are the recommended options for Atlas connections
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
