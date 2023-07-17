import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

/**
 * Config Schema Model for Mongo Database
 * (Mongoose)
 *
 * @export
 * @class Config
 */
@Schema({
  collection: 'configs',
})
export class Config {
  @Prop()
  key: string;

  @Prop()
  value: string;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
