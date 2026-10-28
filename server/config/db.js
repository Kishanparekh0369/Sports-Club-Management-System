const mongoose = require('mongoose');

const connectDB = async (customUri = null) => {
  try {
    const uri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elite_sports_club';
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
