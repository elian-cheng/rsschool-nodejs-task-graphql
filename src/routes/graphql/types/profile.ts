import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { userType } from './user.js';
import { memberType } from './member.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export interface IProfileInput {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
}

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    // user: { type: new GraphQLNonNull(userType) },
    memberType: { type: new GraphQLNonNull(memberType) },
  },
});
