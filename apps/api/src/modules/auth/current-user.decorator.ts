import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: 'userId' | 'roles' | 'isGuest' | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const u = req.user as {
      userId: string;
      roles: string[];
      isGuest: boolean;
    };
    if (data === 'userId') return u?.userId;
    if (data === 'roles') return u?.roles;
    if (data === 'isGuest') return u?.isGuest;
    return u;
  },
);
