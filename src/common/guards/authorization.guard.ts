import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type = context.getType<string>();
    let user: any;
    if (type === 'http') {
      const request = context.switchToHttp().getRequest();
      user = request.user;
    } else if (type === 'ws') {
      const client = context.switchToWs().getClient();
      user = client.data.user;
    }
   else if (type === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext()
      user=req.user;
    }
const allowedRoles = this.reflector.getAllAndOverride<string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);
    const userRoles = user.role;
    if (allowedRoles && allowedRoles.includes(userRoles)) return true;
    return false;
  }
}
