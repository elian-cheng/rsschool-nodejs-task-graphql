import { IContext, IID, DataRecord } from '../types/common.js';
import { IPostInput } from '../types/post.js';

const getPost = async ({ id }: IID, { prisma }: IContext) => {
  const post = await prisma.post.findUnique({ where: { id } });
  return post;
};

const getPosts = async (_: DataRecord, { prisma }: IContext) => {
  const posts = await prisma.post.findMany();
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

export const getPostsByUserId = async (authorId: string, { prisma }: IContext) => {
  const posts = await prisma.post.findMany({ where: { authorId } });
  return posts;
};

export default {
  post: getPost,
  posts: getPosts,
  createPost,
  changePost,
  deletePost,
};
