import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
}
from 'graphql';


//type
import { GraphQLRestaurant } from './restaurant';
import { GraphQLUser } from './user';

//api
import { getRestaurant, getRestaurants } from '../../api/restaurant';
import { getUser } from '../../api/user';


export const queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    restaurant: {
      type: GraphQLRestaurant,
      description: 'fetch a restaurant depending on the id',
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (root, {id}, context, {rootValue}) => getRestaurant(id, rootValue)
    },
    restaurants: {
      type: new GraphQLList(GraphQLRestaurant),
      description: 'The nearest restaurants',
      args: {
        count: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'number of restaurants returned'
        },
        location: {
          type: new GraphQLList(GraphQLFloat),
          description: 'array with longitude and latitude'
        },
        filter: {
          type: new GraphQLList(GraphQLString),
          description: 'filter list to apply'
        },
        sort: {
          type: GraphQLString,
          description: 'sort by ...'
        }
      },
      resolve: (root, args, context, {rootValue}) => getRestaurants(args, rootValue)
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      description: 'the user',
      resolve: (root, {id}, context, {rootValue}) => getUser(rootValue)
    }
  }
});