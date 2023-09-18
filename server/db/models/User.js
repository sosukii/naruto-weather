import { Schema, model } from 'mongoose';

const schema = new Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    unique:false
  },
  name:{
    type:String,
    required:false,
    unique:false
  }
})

export default model('User', schema);
