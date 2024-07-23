import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
config({
  path: fs.existsSync(path.join(process.cwd(), '.env'))
    ? path.join(process.cwd(), '.env')
    : path.join(process.cwd(), '.env.example'),
})

const envConfig = {
  PORT: process.env.PORT || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_NAME: process.env.MONGODB_NAME || '',
  APP_CONTEXT: process.env.APP_CONTEXT || '',
  UPLOAD_DIR: process.env.UPLOAD_DIR || '',
}

declare global {
  var Config: {
    [k in keyof typeof envConfig]: typeof envConfig[k]
  }
}
global.Config = envConfig


