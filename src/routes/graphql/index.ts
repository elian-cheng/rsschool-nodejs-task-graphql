import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, validate, parse } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import userResolvers from './resolvers/user.js';
import memberTypeResolvers from './resolvers/memberType.js';
import postResolvers from './resolvers/post.js';
import profileResolvers from './resolvers/profile.js';
import depthLimit from 'graphql-depth-limit';
import { dataLoadersHandler } from './dataLoaders.js';

const rootValue = {
  ...userResolvers,
  ...memberTypeResolvers,
  ...postResolvers,
  ...profileResolvers,
};

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const dataLoaders = dataLoadersHandler(prisma);

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
      const errors = validate(schema, parse(req.body.query), [depthLimit(5)]);

      if (errors.length) {
        return { errors };
      }
      const response = await graphql({
        schema: schema,
        source: req.body.query,
        rootValue,
        variableValues: req.body.variables,
        contextValue: { prisma, ...dataLoaders },
      });
      return response;
    },
  });
};

export default plugin;
