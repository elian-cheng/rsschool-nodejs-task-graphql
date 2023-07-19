import {
  GraphQLError,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  Kind,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

class MemberTypeError extends GraphQLError {
  constructor() {
    super('Invalid MemberType. Correct type: basic, business');
  }
}

export interface IMemberTypeInput {
  name: string;
  balance: number;
}

const isMemberType = (value: unknown): value is MemberTypeId => {
  if (typeof value !== 'string') {
    return false;
  }

  switch (value) {
    case MemberTypeId.BASIC:
    case MemberTypeId.BUSINESS: {
      return true;
    }
    default: {
      return false;
    }
  }
};

export const memberIdType = new GraphQLScalarType({
  name: 'MemberTypeId',
  serialize(value) {
    if (!isMemberType(value)) {
      throw new MemberTypeError();
    }
    return value;
  },
  parseValue(value) {
    if (!isMemberType(value)) {
      throw new MemberTypeError();
    }
    return value;
  },
  parseLiteral(data) {
    if (data.kind === Kind.STRING) {
      if (isMemberType(data.value)) {
        return data.value;
      }
    }
    throw new MemberTypeError();
  },
});

export const memberType = new GraphQLObjectType({
  name: 'Member',
  fields: {
    id: { type: new GraphQLNonNull(memberIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});
