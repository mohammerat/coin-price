import { Resolver, Query, Args } from '@nestjs/graphql';

import { CoinPriceService } from './coin-price.service';
import { CoinPrice } from './coin-price.schema';
import { CoinPriceInput } from './coin-price.input';

@Resolver((of) => CoinPrice)
export class CoinPriceResolver {
  constructor(private readonly coinService: CoinPriceService) {}

  @Query(() => [CoinPrice])
  getPrices(@Args('data') input: CoinPriceInput) {
    return this.coinService.getPrice(input);
  }
}
