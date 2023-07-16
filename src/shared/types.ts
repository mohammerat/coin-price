import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenericResponseType {
  @Field(() => String, { nullable: false })
  status: string;

  @Field(() => String, { nullable: true })
  message: string;
}
