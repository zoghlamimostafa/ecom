const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.resolve(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

const logFile = path.join(logsDir, 'app.log');

function formatMessage(level, args) {
  const ts = new Date().toISOString();
  const message = args.map(a => {
    try {
      if (typeof a === 'string') return a;
      return JSON.stringify(a, null, 2);
    } catch (e) {
      return String(a);
    }
  }).join(' ');
  return `[${ts}] [${level.toUpperCase()}] ${message}`;
}

function safeAppend(line) {
  try {
    fs.appendFile(logFile, line + '\n', () => {});
  } catch (e) {
    // ignore logging failure
  }
}

// Idempotent patch: don't patch console multiple times
if (!global.__loggerPatched) {
  const origLog = console.log.bind(console);
  const origInfo = console.info ? console.info.bind(console) : origLog;
  const origWarn = console.warn ? console.warn.bind(console) : origLog;
  const origError = console.error ? console.error.bind(console) : origLog;
  const origDebug = console.debug ? console.debug.bind(console) : origLog;

  console.log = function (...args) {
    const line = formatMessage('log', args);
    origLog(line);
    safeAppend(line);
  };

  console.info = function (...args) {
    const line = formatMessage('info', args);
    origInfo(line);
    safeAppend(line);
  };

  console.warn = function (...args) {
    const line = formatMessage('warn', args);
    origWarn(line);
    safeAppend(line);
  };

  console.error = function (...args) {
    const line = formatMessage('error', args);
    origError(line);
    safeAppend(line);
  };

  console.debug = function (...args) {
    const line = formatMessage('debug', args);
    origDebug(line);
    safeAppend(line);
  };

  global.__loggerPatched = true;
}

module.exports = {
  logFile,
};
