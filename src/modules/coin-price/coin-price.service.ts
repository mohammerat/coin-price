import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { Observable, of } from 'rxjs';

import { NobitexProviderService } from '../providers';
import { GenericResponseType } from '../../shared';

import { ChangeIntervalInput, CoinPriceInput } from './coin-price.input';
import { CoinPrice } from './coin-price.schema';

@Injectable()
export class CoinPriceService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(CoinPrice.name, 'DB1')
    private readonly coinModel1: Model<CoinPrice>,
    @InjectModel(CoinPrice.name, 'DB2')
    private readonly coinModel2: Model<CoinPrice>,
    private readonly nobitexService: NobitexProviderService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.logger = new Logger('CoinPrice/CoinPriceService');
  }

  getPrice(input: CoinPriceInput) {
    if (input.dbName === 'DB1') {
      return this.coinModel1.find();
    } else if (input.dbName === 'DB2') {
      return this.coinModel2.find();
    } else {
      this.logger.error(`Error in getting prices from db: ${input.dbName}`);
      throw new BadRequestException('Provided DB name was wrong');
    }
  }

  changeInterval(input: ChangeIntervalInput): Observable<GenericResponseType> {
    const job = this.schedulerRegistry.getCronJob('getPriceCron');
    job.stop();
    this.schedulerRegistry.deleteCronJob('getPriceCron');

    const newJob = new CronJob(
      `* 0/${input.intervalTime} * * * *`,
      this.getPriceCron.bind(this),
    );
    this.schedulerRegistry.addCronJob('getPriceCron', newJob);
    newJob.start();

    this.logger.log(
      `cron job interval has been changed to: every ${input.intervalTime} minutes`,
    );

    return of({ status: 'ok', message: 'New Interval has been set' });
  }

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'getPriceCron' })
  async getPriceCron() {
    const now = new Date();
    const providerResponse = await this.nobitexService.getData();
    this.logger.log(`Getting data from third-party provider`);
    if (providerResponse.status !== 'ok') {
      this.logger.error(
        `Error in response: ${JSON.stringify(providerResponse)}`,
      );
    } else {
      if (now.getHours() <= 12) {
        this.coinModel1.create({
          market: 'kraken',
          price: +providerResponse.btc.kraken.price,
        });
      } else {
        this.coinModel2.create({
          market: 'kraken',
          price: +providerResponse.btc.kraken.price,
        });
      }
    }
  }
}
