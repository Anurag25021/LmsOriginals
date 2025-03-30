import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debugging

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "lms", // Explicitly specifying database name
        });

        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
