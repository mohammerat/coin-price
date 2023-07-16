import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'coin-prices',
})
@ObjectType()
export class CoinPrice {
  @Prop()
  @Field(() => String)
  market: string;

  @Prop()
  @Field(() => Float)
  price: number;

  @Field(() => Date)
  createdAt: Date;
}

export const CoinPriceSchema = SchemaFactory.createForClass(CoinPrice);
