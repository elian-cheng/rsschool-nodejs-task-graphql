import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { IContext, IID, DataRecord, ISubscription } from './common.js';
import { profileType } from './profile.js';
import { postType } from './post.js';

export interface IUserInput {
  name: string;
  balance: number;
}

export interface IUser extends IID, IUserInput {
  userSubscribedTo?: ISubscription[];
  subscribedToUser?: ISubscription[];
}

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType as GraphQLObjectType,
      resolve: async (
        source: IUser,
        _: DataRecord,
        { profileByUserIdLoader }: IContext,
      ) => profileByUserIdLoader.load(source.id),
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
      resolve: async (source: IUser, _: DataRecord, { userLoader }: IContext) =>
        source.userSubscribedTo
          ? userLoader.loadMany(source.userSubscribedTo.map(({ authorId }) => authorId))
          : null,
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (source: IUser, _: DataRecord, { userLoader }: IContext) =>
        source.subscribedToUser
          ? userLoader.loadMany(
              source.subscribedToUser.map(({ subscriberId }) => subscriberId),
            )
          : null,
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
