const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ใช้ Connection String ตรง ๆ แทน `process.env.MONGO_URI`
    await mongoose.connect('your-mongodb-connection-string');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
