import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const type = context.getType().toString();
    if (type === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.res };
    }
    if (type === 'ws') {
      const client = context.switchToWs().getClient();
      return { req: client, res: client };
    }
    const httpCtx = context.switchToHttp();
    return {
      req: httpCtx.getRequest(),
      res: httpCtx.getResponse(),
    };
  }
}
