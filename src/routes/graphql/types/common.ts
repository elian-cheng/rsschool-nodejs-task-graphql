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
  subscriberId: string;
  authorId: string;
}

export interface ISubscriptionMutation {
  userId: string;
  authorId: string;
}
