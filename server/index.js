import {start as serverStart} from './server_instanse.js'
import {connect as dbConnect} from './db/db_instanse.js'

async function start(){
  await serverStart()
  await dbConnect()
}

start()