import { PrismaClient } from '@prisma/client';
import { IID } from '../types/common.js';

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

export default {
  post: getPost,
  posts: getPosts,
};
