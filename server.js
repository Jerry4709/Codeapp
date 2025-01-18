const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // เพิ่มการ Import CORS

const app = express();

// เชื่อมต่อ MongoDB
const MONGO_URI = "mongodb+srv://jimmy551:myPassword@test.rndif.mongodb.net/Test?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // หยุดเซิร์ฟเวอร์หากเชื่อมต่อไม่ได้
  }
};

connectDB();

// Middleware สำหรับ JSON
app.use(express.json());
app.use(cors()); // เพิ่ม Middleware สำหรับ CORS

// เชื่อมต่อ Routes
app.use('/api/auth', require('./routes/auth'));

// ตัวอย่าง Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// รันเซิร์ฟเวอร์
const PORT = process.env.PORT || 5001;  // เปลี่ยนพอร์ตเป็น 5001 หรือพอร์ตที่ว่าง
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

