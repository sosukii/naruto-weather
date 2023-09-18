import express from 'express';
import cors from 'cors'
import {router as routes} from './routes/routes.js';

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/', routes)

export async function start() {
  try{
    app.listen(5000, () => console.log(`♡ server started 5000`))
  }catch(e){
    console.log(e)
  }
}
