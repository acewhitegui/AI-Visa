import {createLogger, format, transports} from 'winston';

const {combine, timestamp, label, printf} = format;

const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(
    label({label: 'ai-visa-web'}),
    timestamp(),
    myFormat
  ),
  defaultMeta: {service: 'ai-visa-web'},
  transports: [
    new transports.Console({
      handleExceptions: true,
      handleRejections: true
    })
  ]
});