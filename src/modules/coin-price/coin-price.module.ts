import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { NobitexProviderService, ProviderModule } from '../providers';

import { CoinPriceResolver } from './coin-price.resolver';
import { CoinPriceService } from './coin-price.service';
import { CoinPrice, CoinPriceSchema, Config, ConfigSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CoinPrice.name, schema: CoinPriceSchema }],
      'DB1',
    ),
    MongooseModule.forFeature(
      [{ name: Config.name, schema: ConfigSchema }],
      'DB1',
    ),
    MongooseModule.forFeature(
      [{ name: CoinPrice.name, schema: CoinPriceSchema }],
      'DB2',
    ),
    MongooseModule.forFeature(
      [{ name: Config.name, schema: ConfigSchema }],
      'DB2',
    ),
    ScheduleModule.forRoot(),
    ProviderModule,
  ],
  providers: [CoinPriceResolver, CoinPriceService, NobitexProviderService],
})
export class CoinPriceModule {}
