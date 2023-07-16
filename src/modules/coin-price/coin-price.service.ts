import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CoinPriceInput } from './coin-price.input';
import { CoinPrice } from './coin-price.schema';

@Injectable()
export class CoinPriceService {
  constructor(
    @InjectModel(CoinPrice.name, 'DB1')
    private readonly coinModel1: Model<CoinPrice>,
    @InjectModel(CoinPrice.name, 'DB2')
    private readonly coinModel2: Model<CoinPrice>,
  ) {}

  getPrice(input: CoinPriceInput) {
    if (input.dbName === 'DB1') {
      return this.coinModel1.find();
    } else if (input.dbName === 'DB2') {
      return this.coinModel2.find();
    } else {
      throw new BadRequestException('Provided DB name was wrong');
    }
  }
}
