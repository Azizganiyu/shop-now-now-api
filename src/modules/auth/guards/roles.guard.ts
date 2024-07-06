import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      roles = this.reflector.get<string[]>('roles', context.getClass());
    }
    if (!roles) {
      return false;
    }
    if (roles[0] === '*') {
      return true;
    }
    if (user.roleId === 'super-admin') {
      return true;
    }
    if (roles.includes(user.roleId)) {
      return true;
    }

    return false;
  }
}
