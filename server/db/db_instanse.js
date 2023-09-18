import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DB

export async function connect() {
  try{
    await mongoose.connect(
      connectionString,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    console.log('♡ db has been connected')
  } catch(e){
    console.log(e)
  }
}
