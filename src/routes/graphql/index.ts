import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import userResolvers from './resolvers/user.js';

const rootValue = {
  ...userResolvers,
};

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const response = await graphql({
        schema: schema,
        source: req.body.query,
        rootValue,
        variableValues: req.body.variables,
        contextValue: { prisma },
      });
      return response;
    },
  });
};

export default plugin;
