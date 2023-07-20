import { GraphQLList, GraphQLResolveInfo } from 'graphql';
import { IUserInput, userType } from '../types/user.js';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { IContext, IID, DataRecord, ISubscriptionMutation } from '../types/common.js';

export const getUser = async ({ id }: IID, { userLoader }: IContext) => {
  const user = await userLoader.load(id);
  return user;
};

const getUsers = async (
  _: DataRecord,
  { prisma, userLoader }: IContext,
  resolveInfo: GraphQLResolveInfo,
) => {
  const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
  const { fields }: { fields: { [key in string]: ResolveTree } } =
    simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment as ResolveTree,
      new GraphQLList(userType),
    );

  const users = await prisma.user.findMany({
    include: {
      userSubscribedTo: !!fields.userSubscribedTo,
      subscribedToUser: !!fields.subscribedToUser,
    },
  });

  return users;
};

const createUser = async ({ dto: data }: { dto: IUserInput }, { prisma }: IContext) => {
  const user = await prisma.user.create({ data });
  return user;
};

const changeUser = async (
  { id, dto: data }: IID & { dto: Partial<IUserInput> },
  { prisma }: IContext,
) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return user;
  } catch {
    return null;
  }
};

const deleteUser = async ({ id }: IID, { prisma }: IContext) => {
  try {
    await prisma.user.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
};

const subscribeTo = async (
  { userId: id, authorId }: ISubscriptionMutation,
  { prisma }: IContext,
) => {
  try {
    const user = prisma.user.update({
      where: { id },
      data: { userSubscribedTo: { create: { authorId } } },
    });
    return user;
  } catch {
    return null;
  }
};

const unsubscribeFrom = async (
  { userId: subscriberId, authorId }: ISubscriptionMutation,
  { prisma }: IContext,
) => {
  try {
    await prisma.subscribersOnAuthors.delete({
      where: { subscriberId_authorId: { subscriberId, authorId } },
    });
  } catch {
    return null;
  }
};

export default {
  user: getUser,
  users: getUsers,
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
};
