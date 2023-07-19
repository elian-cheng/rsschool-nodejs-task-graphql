import { PrismaClient } from '@prisma/client';

export interface IID {
  id: string;
}

export type DataRecord = Record<string | number | symbol, never>;

export interface IContext {
  prisma: PrismaClient;
}
