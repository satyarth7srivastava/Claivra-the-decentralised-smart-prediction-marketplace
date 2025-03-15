import mongoose from 'mongoose';

const connect  = async () => {
    try {
        console.log("Connecting to database with URI: ", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const conn = mongoose.connection;
        conn.on('error', console.error.bind(console, 'connection error:'));
        conn.once("connect", ()=>{
            console.log("Connected to database");
        })
    } catch (error) {
        console.log("Error in connecting to database: ", error);
    }
}

export default connect;