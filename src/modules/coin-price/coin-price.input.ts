import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, Min, Max } from 'class-validator';

/**
 * Input type for getting coin prices
 *
 * @export CoinPriceInput
 */
@InputType()
export class CoinPriceInput {
  @Field(() => String, { nullable: false })
  dbName: string;
}

/**
 * Input type for changing cron interval
 *
 * @export ChangeIntervalInput
 */
@InputType()
export class ChangeIntervalInput {
  @Field(() => Int, { nullable: false })
  @IsNumber()
  @Min(5)
  @Max(55)
  intervalTime: number;
}
