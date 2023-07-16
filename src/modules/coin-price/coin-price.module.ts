import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { NobitexProviderService, ProviderModule } from '../providers';

import { CoinPriceResolver } from './coin-price.resolver';
import { CoinPriceService } from './coin-price.service';
import { CoinPrice, CoinPriceSchema } from './coin-price.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CoinPrice.name, schema: CoinPriceSchema }],
      'DB1',
    ),
    MongooseModule.forFeature(
      [{ name: CoinPrice.name, schema: CoinPriceSchema }],
      'DB2',
    ),
    ScheduleModule.forRoot(),
    ProviderModule,
  ],
  providers: [CoinPriceResolver, CoinPriceService, NobitexProviderService],
})
export class CoinPriceModule {}
