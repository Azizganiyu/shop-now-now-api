import { plainToClass } from 'class-transformer';
import { IsDefined, IsEnum, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
  Staging = 'staging',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsDefined()
  SECRET: string;

  @IsDefined()
  APP_URL: string;

  @IsDefined()
  APP_NAME: string;

  @IsDefined()
  DOMAIN: string;

  @IsDefined()
  SUPPORT_EMAIL: string;

  @IsDefined()
  APP_ADMIN_URL: string;

  @IsDefined()
  APP_SERVER_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
