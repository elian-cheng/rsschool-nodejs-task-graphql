import { IContext, IID, DataRecord } from '../types/common.js';
import { IProfileInput } from '../types/profile.js';
import { MemberTypeId } from '../../member-types/schemas.js';

const getProfile = async ({ id }: IID, { prisma }: IContext) => {
  const profile = await prisma.profile.findUnique({ where: { id } });
  return profile;
};

const getProfiles = async (_: DataRecord, { prisma }: IContext) => {
  const profiles = await prisma.profile.findMany();
  return profiles;
};

const createProfile = async (
  { dto: data }: { dto: IProfileInput },
  { prisma }: IContext,
) => {
  try {
    const profile = await prisma.profile.create({ data });
    return profile;
  } catch {
    return null;
  }
};

const changeProfile = async (
  { id, dto: data }: IID & { dto: Partial<IProfileInput> },
  { prisma }: IContext,
) => {
  try {
    const profile = await prisma.profile.update({
      where: { id },
      data,
    });
    return profile;
  } catch {
    return null;
  }
};

const deleteProfile = async ({ id }: IID, { prisma }: IContext) => {
  try {
    await prisma.profile.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
};

export const getProfileByUserId = async (userId: string, { prisma }: IContext) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  return profile;
};

export const getProfilesByMemberTypeId = async (
  memberTypeId: MemberTypeId,
  { prisma }: IContext,
) => {
  const profiles = await prisma.profile.findMany({ where: { memberTypeId } });
  return profiles;
};

export default {
  profile: getProfile,
  profiles: getProfiles,
  createProfile,
  changeProfile,
  deleteProfile,
};