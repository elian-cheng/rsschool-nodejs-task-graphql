import { MemberType, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeId } from '../member-types/schemas.js';
import { IPost } from './types/post.js';

export interface IDataLoaders {
  postsByAuthorIdLoader: DataLoader<string, IPost[]>;
  memberTypeLoader: DataLoader<MemberTypeId, MemberType>;
}

export const dataLoadersHandler = (prisma: PrismaClient): IDataLoaders => {
  const getPostsByAuthorIdBatch = async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });
    return ids.map((id) => posts.filter((post) => id === post.authorId));
  };

  const getMemberTypeBatch = async (ids: readonly MemberTypeId[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as MemberTypeId[] } },
    });
    return ids.map(
      (id) => memberTypes.find((memberType) => id === memberType.id) as MemberType,
    );
  };

  return {
    postsByAuthorIdLoader: new DataLoader(getPostsByAuthorIdBatch),
    memberTypeLoader: new DataLoader(getMemberTypeBatch),
  };
};
