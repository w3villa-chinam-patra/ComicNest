import { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      // This adds the 'user' property to the Request interface
      user?: User;
    }
  }
}