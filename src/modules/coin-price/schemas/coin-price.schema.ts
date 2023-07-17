import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Coin Price Schema Model for Mongo Database
 * (Mongoose)
 *
 * @export
 * @class CoinPrice
 */
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
  @Field(() => String)
  coin: string;

  @Prop()
  @Field(() => Float)
  price: number;

  @Field(() => Date)
  createdAt: Date;
}

export const CoinPriceSchema = SchemaFactory.createForClass(CoinPrice);
