import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { ApiLog } from 'src/modules/activity/entities/api-logs.entity';
import { Repository } from 'typeorm';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectRepository(ApiLog)
    private apiLogRepository: Repository<ApiLog>,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: any = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error: any = exception.getResponse();

    const log: ApiLog = {
      accessType: request.user ? request.user.roleId : null,
      accessId: request.user ? request.user.id : null,
      email: request.user ? request.user.email : null,
      type: 'request_response',
      path: request?.url,
      payload: request.body ? JSON.stringify(request.body) : null,
      message: error.message
        ? error.message.split('?')[0]
        : status == 429
          ? 'Exceeded limit'
          : '',
      ipAddress: request.ip,
      response: JSON.stringify({
        status: false,
        statusCode: status,
        message: error.message
          ? error.message.split('?')[0]
          : status == 429
            ? 'Exceeded limit'
            : '',
      }),
      status: false,
    };

    const exempted = [];
    if (!exempted.includes(request?.path)) {
      const createLog = this.apiLogRepository.create(log);
      await this.apiLogRepository.save(createLog);
    }

    response.status(status).json({
      status: false,
      statusCode: status,
      message: error.message?.split('?')[0],
    });
  }
}
