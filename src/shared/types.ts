import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Generic Response Type
 *
 * @export GenericResponseType
 */
@ObjectType()
export class GenericResponseType {
  @Field(() => String, { nullable: false })
  status: string;

  @Field(() => String, { nullable: true })
  message: string;
}
