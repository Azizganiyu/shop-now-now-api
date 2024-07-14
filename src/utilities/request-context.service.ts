import { Injectable } from '@nestjs/common';
import { RequestContext } from '@medibloc/nestjs-request-context';

export class MyRequestContext extends RequestContext {
  token: string;
  ip: string;
  roleTag: string;
}

@Injectable()
export class RequestContextService {
  /**
   * Sets the token in the request context.
   *
   * @param {string} token The token to set.
   */
  set token(token: string) {
    const ctx: MyRequestContext = RequestContext.get();
    ctx.token = token;
  }

  /**
   * Retrieves the token from the request context.
   *
   * @returns {string} The token value.
   */
  get token() {
    const ctx: MyRequestContext = RequestContext.get();
    return ctx.token;
  }

  /**
   * Sets the IP address in the request context.
   *
   * @param {string} ip The IP address to set.
   */
  set ip(ip: string) {
    const ctx: MyRequestContext = RequestContext.get();
    ctx.ip = ip;
  }

  /**
   * Retrieves the IP address from the request context.
   *
   * @returns {string} The IP address value.
   */
  get ip() {
    const ctx: MyRequestContext = RequestContext.get();
    return ctx.ip;
  }

  /**
   * Sets roleTag in the request context.
   *
   * @param {string} roleTag The roleTag to set.
   */
  set roleTag(roleTag: string) {
    const ctx: MyRequestContext = RequestContext.get();
    ctx.roleTag = roleTag;
  }

  /**
   * Retrieves the the roleTag from the request context.
   *
   * @returns {string} The roleTag value.
   */
  get roleTag() {
    const ctx: MyRequestContext = RequestContext.get();
    return ctx.roleTag;
  }
}
