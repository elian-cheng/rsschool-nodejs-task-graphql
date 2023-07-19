import { IUserInput } from '../types/user.js';
import { IContext, IID, DataRecord, ISubscription } from '../types/common.js';

export const getUser = async ({ id }: IID, { prisma }: IContext) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

const getUsers = async (_: DataRecord, { prisma }: IContext) => {
  const users = await prisma.user.findMany();
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
  { userId: id, authorId }: ISubscription,
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
  { userId: subscriberId, authorId }: ISubscription,
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

export const getUserSubscriptions = async (
  subscriberId: string,
  { prisma }: IContext,
) => {
  const subscriptions = await prisma.user.findMany({
    where: { subscribedToUser: { some: { subscriberId } } },
  });
  return subscriptions;
};

export const getUserFollowers = async (authorId: string, { prisma }: IContext) => {
  const followers = await prisma.user.findMany({
    where: { userSubscribedTo: { some: { authorId } } },
  });
  return followers;
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
