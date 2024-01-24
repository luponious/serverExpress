import mongoose from 'mongoose'
import { MONGODB_CNX_STR } from './config.js'

export async function connectDb() {
  await mongoose.connect(MONGODB_CNX_STR)
  console.log(`Conectado a base de datos.`)
}