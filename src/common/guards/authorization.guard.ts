import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type = context.getType();
    let user: any;
    if (type === 'http') {
      const request = context.switchToHttp().getRequest();
      user = request.user;
    } else if (type === 'ws') {
      const client = context.switchToWs().getClient();
      user = client.data.user;
    }
    const methodRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const classRoles = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );
    const allowedRoles = methodRoles || classRoles;
    const userRoles = user.role;
    if (allowedRoles && allowedRoles.includes(userRoles)) return true;
    return false;
  }
}
