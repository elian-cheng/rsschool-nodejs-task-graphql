import { PrismaClient } from '@prisma/client';
import { IContext, IID } from '../types/common.js';
import { IPostInput } from '../types/post.js';

const prisma = new PrismaClient();

const getPost = async (args: IID) => {
  const post = await prisma.post.findUnique({
    where: {
      id: args.id,
    },
  });
  return post;
};

const getPosts = async () => {
  const posts = await prisma.post.findMany();
  return posts;
};

export const getPostsByUserId = async (authorId: string) => {
  const posts = await prisma.post.findMany({ where: { authorId } });
  return posts;
};

const createPost = async ({ dto: data }: { dto: IPostInput }, { prisma }: IContext) => {
  const post = await prisma.post.create({ data });
  return post;
};

const changePost = async (
  { id, dto: data }: IID & { dto: Partial<IPostInput> },
  { prisma }: IContext,
) => {
  try {
    const post = await prisma.post.update({
      where: { id },
      data,
    });
    return post;
  } catch {
    return null;
  }
};

const deletePost = async ({ id }: IID, { prisma }: IContext) => {
  try {
    await prisma.post.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
};

export default {
  post: getPost,
  posts: getPosts,
  createPost,
  changePost,
  deletePost,
};
