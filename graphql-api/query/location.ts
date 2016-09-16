import { GraphQLInputObjectType, GraphQLObjectType, GraphQLFloat, GraphQLList, GraphQLString } from 'graphql';
export const GraphQLLocation = new GraphQLObjectType({
  name: 'Location',
  fields: {
    coordinates: {
      type: new GraphQLList(GraphQLFloat)
    },
    type: {
      type: GraphQLString
    }
  }
});

export const GraphQLInputLocation = new GraphQLInputObjectType({
  name: 'InputLocation',
  fields: {
    coordinates: {
      type: new GraphQLList(GraphQLFloat)
    },
    type: {
      type: GraphQLString
    }
  }
});