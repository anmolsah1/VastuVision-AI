/**
 * @file logger.js
 * @description Simple, colored console logger utility.
 * Can be replaced with Winston/Pino for production use.
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  grey: '\x1b[90m',
};

const timestamp = () => new Date().toISOString();

const logger = {
  info: (msg) => console.log(`${colors.green}[INFO]${colors.reset} ${colors.grey}${timestamp()}${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${colors.grey}${timestamp()}${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${colors.grey}${timestamp()}${colors.reset} ${msg}`),
  debug: (msg) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.cyan}[DEBUG]${colors.reset} ${colors.grey}${timestamp()}${colors.reset} ${msg}`);
    }
  },
  ai: (msg) => console.log(`${colors.cyan}[AI]${colors.reset} ${colors.grey}${timestamp()}${colors.reset} ${msg}`),
};

module.exports = logger;
