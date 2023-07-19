import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { memberType, memberTypeIdEnum } from './member.js';
import { IContext, IID, DataRecord } from './common.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { getMemberType } from '../resolvers/memberType.js';
import { userType } from './user.js';
import { getUser } from '../resolvers/user.js';

export interface IProfileInput {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
}

export interface IProfile extends IID, IProfileInput {}

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(memberType),
      resolve: async (source: IProfile, _: DataRecord, context: IContext) =>
        await getMemberType({ id: source.memberTypeId }, context),
    },
    user: {
      type: userType as GraphQLObjectType,
      resolve: async (source: IProfile, _: DataRecord, context: IContext) =>
        await getUser({ id: source.userId }, context),
    },
  }),
});

export const createProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(memberTypeIdEnum) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  },
});

export const changeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberTypeIdEnum },
  },
});
