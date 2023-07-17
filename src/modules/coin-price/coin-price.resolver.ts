import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { GenericResponseType } from 'src/shared';
import { CoinPriceService } from './coin-price.service';
import { CoinPrice } from './schemas/coin-price.schema';
import { ChangeIntervalInput, CoinPriceInput } from './coin-price.input';

@Resolver(() => CoinPrice)
export class CoinPriceResolver {
  constructor(private readonly coinService: CoinPriceService) {}

  /**
   * Get coin prices based on db input
   *
   * @param {CoinPriceInput} input input params
   * @returns {Promise<CoinPrice[]>} {Promise<CoinPrice[]>}
   */
  @Query(() => [CoinPrice])
  getPrices(@Args('data') input: CoinPriceInput) {
    return this.coinService.getPrice(input);
  }

  /**
   * Change interval based on input
   *
   * @param {ChangeIntervalInput} input input params
   * @returns {Promise<GenericResponseType>} {Promise<GenericResponseType>}
   */
  @Mutation(() => GenericResponseType)
  changeInterval(@Args('data') input: ChangeIntervalInput) {
    return this.coinService.changeInterval(input);
  }
}
