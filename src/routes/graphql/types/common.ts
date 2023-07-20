import { PrismaClient } from '@prisma/client';
import { IDataLoaders } from '../dataLoaders.js';

export interface IID {
  id: string;
}

export type DataRecord = Record<string | number | symbol, never>;

export interface IContext extends IDataLoaders {
  prisma: PrismaClient;
}

export interface ISubscription {
  userId: string;
  authorId: string;
}
