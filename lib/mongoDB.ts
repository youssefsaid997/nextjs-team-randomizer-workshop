import mongoose from "mongoose";


async function connectDB(uri?:string){
    try {
        await mongoose.connect(uri || 'mongodb+srv://youssefsaidyu_db_user:e6PafhVCRQHmUjK9@cluster0.vqhoqig.mongodb.net/workshop')
    } catch (error) {
        const err = error as Error
        console.log('Database error:',err.message)
    }
} 



export {connectDB }