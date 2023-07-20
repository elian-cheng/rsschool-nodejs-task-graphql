import { MemberType, PrismaClient, Profile } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeId } from '../member-types/schemas.js';
import { IPost } from './types/post.js';
import { IUser } from './types/user.js';

export interface IDataLoaders {
  postsByAuthorIdLoader: DataLoader<string, IPost[]>;
  profileByUserIdLoader: DataLoader<string, Profile>;
  memberTypeLoader: DataLoader<MemberTypeId, MemberType>;
  profilesByMemberTypeIdLoader: DataLoader<string, Profile[]>;
  userSubscriptionsLoader: DataLoader<string, IUser[]>;
  userFollowersLoader: DataLoader<string, IUser[]>;
}

export const dataLoadersHandler = (prisma: PrismaClient): IDataLoaders => {
  const getProfileByUserIdBatch = async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    const profileMap = profiles.reduce(
      (acc, profile) => {
        acc[profile.userId] = profile;
        return acc;
      },
      {} as Record<string, Profile>,
    );

    return ids.map((id) => profileMap[id]);
  };

  const getPostsByAuthorIdBatch = async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });
    const postMap = posts.reduce(
      (acc, post) => {
        acc[post.authorId]
          ? acc[post.authorId].push(post)
          : (acc[post.authorId] = [post]);
        return acc;
      },
      {} as Record<string, IPost[]>,
    );

    return ids.map((id) => postMap[id]);
  };

  const getMemberTypeBatch = async (ids: readonly MemberTypeId[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as MemberTypeId[] } },
    });
    const memberTypeMap = memberTypes.reduce(
      (acc, memberType) => {
        acc[memberType.id] = memberType;
        return acc;
      },
      {} as Record<MemberTypeId, MemberType>,
    );

    return ids.map((id) => memberTypeMap[id]);
  };

  const getProfilesByMemberTypeIdBatch = async (ids: readonly MemberTypeId[]) => {
    const profiles = await prisma.profile.findMany({
      where: { memberTypeId: { in: ids as MemberTypeId[] } },
    });

    const profileMap = profiles.reduce(
      (acc, profile) => {
        acc[profile.memberTypeId]
          ? acc[profile.memberTypeId].push(profile)
          : (acc[profile.memberTypeId] = [profile]);
        return acc;
      },
      {} as Record<string, Profile[]>,
    );

    return ids.map((id) => profileMap[id]);
  };

  const getUserSubscriptionsBatch = async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { subscribedToUser: { some: { subscriberId: { in: ids as string[] } } } },
      include: { subscribedToUser: { select: { subscriberId: true } } },
    });

    const usersMap = users.reduce(
      (acc, { subscribedToUser, ...user }) => {
        subscribedToUser.forEach(({ subscriberId }) => {
          acc[subscriberId] ? acc[subscriberId].push(user) : (acc[subscriberId] = [user]);
        });
        return acc;
      },
      {} as Record<string, IUser[]>,
    );

    return ids.map((id) => usersMap[id]);
  };

  const getUserFollowersBatch = async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { userSubscribedTo: { some: { authorId: { in: ids as string[] } } } },
      include: { userSubscribedTo: { select: { authorId: true } } },
    });

    const userMap = users.reduce(
      (acc, { userSubscribedTo, ...user }) => {
        userSubscribedTo.forEach(({ authorId }) => {
          acc[authorId] ? acc[authorId].push(user) : (acc[authorId] = [user]);
        });
        return acc;
      },
      {} as Record<string, IUser[]>,
    );

    return ids.map((id) => userMap[id]);
  };

  return {
    profileByUserIdLoader: new DataLoader(getProfileByUserIdBatch),
    postsByAuthorIdLoader: new DataLoader(getPostsByAuthorIdBatch),
    memberTypeLoader: new DataLoader(getMemberTypeBatch),
    profilesByMemberTypeIdLoader: new DataLoader(getProfilesByMemberTypeIdBatch),
    userSubscriptionsLoader: new DataLoader(getUserSubscriptionsBatch),
    userFollowersLoader: new DataLoader(getUserFollowersBatch),
  };
};
