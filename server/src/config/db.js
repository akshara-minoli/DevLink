import mongoose from 'mongoose';

const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Skipping database connection.');
    return null;
  }

  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');
  return mongoose.connection;
};

export default connectDB;
