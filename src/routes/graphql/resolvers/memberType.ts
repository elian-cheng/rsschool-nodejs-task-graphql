import { IContext, IID, DataRecord } from '../types/common.js';

export const getMemberType = async ({ id }: IID, { prisma }: IContext) => {
  const memberType = await prisma.memberType.findUnique({ where: { id } });
  return memberType;
};

const getMemberTypes = async (_: DataRecord, { prisma }: IContext) => {
  const memberTypes = await prisma.memberType.findMany();
  return memberTypes;
};

export default {
  memberType: getMemberType,
  memberTypes: getMemberTypes,
};
