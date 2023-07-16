import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { GenericResponseType } from 'src/shared';
import { CoinPriceService } from './coin-price.service';
import { CoinPrice } from './coin-price.schema';
import { ChangeIntervalInput, CoinPriceInput } from './coin-price.input';

@Resolver(() => CoinPrice)
export class CoinPriceResolver {
  constructor(private readonly coinService: CoinPriceService) {}

  @Query(() => [CoinPrice])
  getPrices(@Args('data') input: CoinPriceInput) {
    return this.coinService.getPrice(input);
  }

  @Mutation(() => GenericResponseType)
  changeInterval(@Args('data') input: ChangeIntervalInput) {
    return this.coinService.changeInterval(input);
  }
}
