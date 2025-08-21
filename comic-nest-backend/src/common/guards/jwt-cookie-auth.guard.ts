import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException, // Or use your AppError
} from '@nestjs/common';
import { Request } from 'express';
import { JWTService } from '../services';
import { AppError } from '../errors';
import { errorMessages } from '../constants';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new AppError(errorMessages.UNAUTHORIZED_ACCESS);
    }

    const verifyTokenDetails = await this.jwtService.verifyToken(token);
    if (
      !verifyTokenDetails.valid ||
      !verifyTokenDetails.payload ||
      verifyTokenDetails.expired
    ) {
      throw new AppError(errorMessages.UNAUTHORIZED_ACCESS);
    }

    const user = await this.userService.findOne(verifyTokenDetails.payload.id);

    // **ADD THIS CHECK**
    // If no user is found with the ID from the token, deny access.
    if (!user) {
      throw new AppError(errorMessages.UNAUTHORIZED_ACCESS);
    }

    // Now, 'user' is guaranteed to be a User object, not undefined.
    request['user'] = user;
    return true;
  }
}