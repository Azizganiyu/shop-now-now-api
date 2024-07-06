import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, Observable } from 'rxjs';
import { ApiLog } from 'src/modules/activity/entities/api-logs.entity';
import { RequestContextService } from 'src/utilities/request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class MyInterceptor implements NestInterceptor {
  private sizeLimit = 10000000;

  constructor(
    private requestContext: RequestContextService,
    @InjectRepository(ApiLog)
    private apiLogRepository: Repository<ApiLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const size = request.socket.bytesRead;
    if (size > this.sizeLimit) {
      throw new BadRequestException('request size too large');
    }

    //set IP
    this.requestContext.ip = request.ip;

    //trim request body properties
    if (request.body) {
      for (const key in request.body) {
        if (typeof request.body[key] == 'string') {
          request.body[key] = request.body[key].trim();
          if (request.body[key].length == 0) {
            request.body[key] = null;
          }
        }
      }
    }

    return next.handle().pipe(
      map(async (data) => {
        if (data?.status && data?.message && !data?.data) {
          data = {
            status: data?.status,
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data?.message,
          };
        }
        if (data?.status && data?.message && data?.data) {
          data = {
            status: data?.status,
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data?.message,
            data: data?.data,
          };
        }

        const log: ApiLog = {
          accessType: request.user ? request.user.roleId : null,
          accessId: request.user ? request.user.id : null,
          email: request.user ? request.user.email : null,
          type: 'request_response',
          path: request?.url,
          payload: request.body ? JSON.stringify(request.body) : null,
          message: data?.message ? data?.message : '',
          ipAddress: request.ip,
          response: data ? JSON.stringify(data) : null,
          status: true,
        };

        const exempted = [];
        if (!exempted.includes(request?.path)) {
          const createLog = this.apiLogRepository.create(log);
          await this.apiLogRepository.save(createLog);
        }

        return data;
      }),
    );
  }
}
