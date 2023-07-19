import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { IContext, IID, DataRecord } from './common.js';
import { userType } from './user.js';
import { getUser } from '../resolvers/user.js';

export interface IPostInput {
  title: string;
  content: string;
  authorId: string;
}

export interface IPost extends IID, IPostInput {}

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: userType,
      resolve: async (source: IPost, _: DataRecord, context: IContext) =>
        await getUser({ id: source.authorId }, context),
    },
  }),
});

export const createPostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

export const changePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});
