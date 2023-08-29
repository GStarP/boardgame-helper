import { logger as Logger, consoleTransport } from "react-native-logs";

const config = {
  transport: consoleTransport,
  severity: "debug",
};

const logger = Logger.createLogger(config);

export { logger };
