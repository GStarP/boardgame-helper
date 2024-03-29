import { logger as Logger, consoleTransport } from 'react-native-logs'

const config = {
  transport: consoleTransport,
  severity: __DEV__ ? 'debug' : 'info',
}

const logger = Logger.createLogger(config)

export { logger }
