import {
  Injectable,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';

import { NobitexProviderService } from '../providers';
import { GenericResponseType } from '../../shared';

import { ChangeIntervalInput, CoinPriceInput } from './coin-price.input';
import { Config, CoinPrice } from './schemas';

@Injectable()
export class CoinPriceService implements OnModuleInit {
  private readonly logger: Logger;

  constructor(
    @InjectModel(CoinPrice.name, 'DB1')
    private readonly coinModel1: Model<CoinPrice>,
    @InjectModel(CoinPrice.name, 'DB2')
    private readonly coinModel2: Model<CoinPrice>,
    @InjectModel(Config.name, 'DB1')
    private readonly configModel1: Model<Config>,
    @InjectModel(Config.name, 'DB2')
    private readonly configModel2: Model<Config>,
    private readonly nobitexService: NobitexProviderService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.logger = new Logger('CoinPrice/CoinPriceService');
  }

  async onModuleInit() {
    const cronIntervalConfig = await this.configModel1.findOne({
      key: 'cronInterval',
    });
    const newJob = new CronJob(
      `0 */${cronIntervalConfig?.value ?? '5'} * * * *`,
      this.getPriceCron.bind(this),
    );
    this.schedulerRegistry.addCronJob('getPriceCron', newJob);
    newJob.start();
    this.logger.log(
      `cron job interval has been set to: every ${
        cronIntervalConfig?.value ?? '5'
      } minutes`,
    );
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

  async changeInterval(
    input: ChangeIntervalInput,
  ): Promise<GenericResponseType> {
    const job = this.schedulerRegistry.getCronJob('getPriceCron');
    job.stop();
    this.schedulerRegistry.deleteCronJob('getPriceCron');

    await this.configModel1.findOneAndUpdate(
      {
        key: 'cronInterval',
      },
      {
        value: String(input.intervalTime),
      },
      {
        upsert: true,
      },
    );

    await this.configModel2.findOneAndUpdate(
      {
        key: 'cronInterval',
      },
      {
        value: String(input.intervalTime),
      },
      {
        upsert: true,
      },
    );

    const newJob = new CronJob(
      `0 */${input.intervalTime} * * * *`,
      this.getPriceCron.bind(this),
    );
    this.schedulerRegistry.addCronJob('getPriceCron', newJob);
    newJob.start();

    this.logger.log(
      `cron job interval has been changed to: every ${input.intervalTime} minutes`,
    );

    return { status: 'ok', message: 'New Interval has been set' };
  }

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
          coin: 'btc',
          price: +providerResponse.btc.kraken.price,
        });
      } else {
        this.coinModel2.create({
          market: 'kraken',
          coin: 'btc',
          price: +providerResponse.btc.kraken.price,
        });
      }
    }
  }
}
