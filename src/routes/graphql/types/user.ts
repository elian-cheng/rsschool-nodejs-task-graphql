import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { IContext, IID, DataRecord } from './common.js';
import { profileType } from './profile.js';
import { getProfileByUserId } from '../resolvers/profile.js';
import { postType } from './post.js';
import { getUserFollowers, getUserSubscriptions } from '../resolvers/user.js';

export interface IUserInput {
  name: string;
  balance: number;
}

export interface IUser extends IID, IUserInput {}

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType as GraphQLObjectType,
      resolve: async (source: IUser, _: DataRecord, context: IContext) =>
        await getProfileByUserId(source.id, context),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (
        source: IUser,
        _: DataRecord,
        { postsByAuthorIdLoader }: IContext,
      ) => postsByAuthorIdLoader.load(source.id),
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (source: IUser, _: DataRecord, context: IContext) =>
        await getUserSubscriptions(source.id, context),
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (source: IUser, _: DataRecord, context: IContext) =>
        await getUserFollowers(source.id, context),
    },
  }),
});

export const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const changeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
