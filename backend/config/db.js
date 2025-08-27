import mongoose from "mongoose";

async function connectDB() {
   try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`); 

    const indexes = await mongoose.connection.collection('users').indexes();
    const hasFirebaseUIDIndex = indexes.some(index => index.name === 'firebaseUID_1');

    if (hasFirebaseUIDIndex) {
        await mongoose.connection.collection('users').dropIndex('firebaseUID_1');
       // console.log("Index 'firebaseUID_1' dropped.");
    } 

} catch (error) {
    console.log("MongoDB Error:", error);
}

}

export default connectDB;