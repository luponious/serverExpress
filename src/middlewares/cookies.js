import cookieParser from 'cookie-parser'
import { COOKIE_SECRET } from '../config.js'

export const cookies = cookieParser(COOKIE_SECRET)