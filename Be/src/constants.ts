import { initializeConstants } from '@proton/wrap-constants'
import * as dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT || 3000
export const DB_CONN_STRING = process.env.DB_CONN_STRING!
export const POSTGRES_CONN_STRING = process.env.POSTGRES_CONN_STRING
export const MARIADB_HOST = process.env.MARIADB_HOST
export const MARIADB_PORT = +(process.env.MARIADB_PORT as string)
export const MARIADB_USER = process.env.MARIADB_USER
export const MARIADB_PASSWORD = process.env.MARIADB_PASSWORD
export const MARIADB_DATABASE = process.env.MARIADB_DATABASE

const localConstants = {
  CHAIN: 'proton',
  GOVERNANCE_CONTRACT: 'gov',
  LIGHT_API_WS: 'wss://lightapi.eosamsterdam.net/wsapi',
  ENDPOINTS: ['https://metal-proton-rpc.global.binfra.one'],
}

const wrapContracts = initializeConstants(localConstants.CHAIN)

export default {
  ...localConstants,
  ...wrapContracts
}
