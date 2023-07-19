import { IUserInput } from '../types/user.js';
import { IContext, IID, DataRecord } from '../types/common.js';

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

export default {
  user: getUser,
  users: getUsers,
  createUser,
  changeUser,
  deleteUser,
};
