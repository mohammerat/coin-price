import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CoinPriceInput {
  @Field(() => String, { nullable: false })
  dbName: string;
}
