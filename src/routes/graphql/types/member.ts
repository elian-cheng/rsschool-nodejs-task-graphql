import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { profileType } from './profile.js';
import { getProfilesByMemberTypeId } from '../resolvers/profile.js';
import { IContext, DataRecord } from './common.js';

interface IMemberType {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
}

export const memberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: {
      value: MemberTypeId.BASIC,
    },
    [MemberTypeId.BUSINESS]: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const memberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: memberTypeIdEnum },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (source: IMemberType, _: DataRecord, context: IContext) =>
        await getProfilesByMemberTypeId(source.id, context),
    },
  }),
});
