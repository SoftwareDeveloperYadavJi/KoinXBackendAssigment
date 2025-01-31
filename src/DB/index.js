import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDb, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};



export default connectDB;

