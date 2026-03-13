import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private  reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type = context.getType();
    let user: any;
    if (type === 'http') {
      const request = context.switchToHttp().getRequest();
      user = request.user;
    }
    const request = context.switchToHttp().getRequest();
    const methodRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const classRoles = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );
    const allowedRoles = methodRoles || classRoles;
    const userRoles = request.user.role;
    if (allowedRoles && allowedRoles.includes(userRoles)) return true;
    return false;
  }
}
