import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const customTimestamp = winston.format((info) => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  const aMpM = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  const hourStr = String(hour).padStart(2, '0');

  // Get timezone offset in minutes and convert to GMT+/-HH:mm
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const offsetMinutes = String(absOffset % 60).padStart(2, '0');
  const timezone = `GMT${sign}${offsetHours}:${offsetMinutes}`;

  const formatted = `${day}-${month}-${year} ${hourStr}:${minute}:${second}(${aMpM}) ${timezone}`;
  const iso = date.toISOString();

  info.timestamp = `${formatted} <> ${iso}`;
  return info;
});

export const winstonLoggerOptions: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        customTimestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, context, message }) =>
            `[${timestamp}] [${context || 'App'}] ${level}: ${message}`
        )
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      format: winston.format.combine(
        customTimestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      format: winston.format.combine(
        customTimestamp(),
        winston.format.json()
      ),
    }),
  ],
};
