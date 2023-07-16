import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NobitexProviderService } from './nobitex-provider.service';

@Module({
  imports: [HttpModule],
  exports: [HttpModule],
  providers: [NobitexProviderService],
})
export class ProviderModule {}
