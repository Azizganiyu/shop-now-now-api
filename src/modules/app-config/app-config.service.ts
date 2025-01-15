import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateConfigDto } from './dto/app-config.dto';
import { AppConfig } from './entities/app-config.entity';
import { HelperService } from 'src/utilities/helper.service';

@Injectable()
export class AppConfigService {
  constructor(
    @InjectRepository(AppConfig)
    private configRepository: Repository<AppConfig>,
    private helperService: HelperService,
  ) {}

  async setConfig(config: CreateConfigDto) {
    return await this.configRepository.update(
      { id: Not(IsNull()) },
      this.helperService.removeNull(config),
    );
  }

  async getConfig() {
    return await this.configRepository.findOneBy({ id: Not(IsNull()) });
  }
}
