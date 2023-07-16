import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, Min, Max } from 'class-validator';

@InputType()
export class CoinPriceInput {
  @Field(() => String, { nullable: false })
  dbName: string;
}

@InputType()
export class ChangeIntervalInput {
  @Field(() => Int, { nullable: false })
  @IsNumber()
  @Min(5)
  @Max(55)
  intervalTime: number;
}
