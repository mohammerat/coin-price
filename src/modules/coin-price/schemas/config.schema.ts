import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

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
