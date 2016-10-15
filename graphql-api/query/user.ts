import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLResolveInfo,
  GraphQLSchema,
  GraphQLString
}                                   from 'graphql';


import {GraphQLRestaurant}          from './restaurant';
import {GraphQLItem}                from './order';
//api
import {getUserRestaurants,
  getUserOrders} from '../../api/user';


export const SimpleOrder = new GraphQLObjectType({
  name: 'simpleOrder',
  fields: {
    id: {
      type: GraphQLID
    },
    restaurantID: {
      type: GraphQLID,
      description: 'the restaurant who get ordered'
    },
    price: {
      type: GraphQLInt,
      description: 'the order value, expressed with an integer'
    },
    message: {
      type: GraphQLString,
      description: 'a message along the order'
    },
    items: {
      type: new GraphQLList(GraphQLItem),
      description: 'the items in that order'
    },
    prepayed: {
      type: GraphQLBoolean,
      description: 'is the order prepayed'
    },
    payed: {
      type: GraphQLBoolean,
      description: 'is the order payed ?'
    },
    treated: {
      type: GraphQLBoolean,
      description: 'is the order processed ?'
    },
    created: {
      type: GraphQLInt,
      description: 'the date the order has been done in milliseconds since january 1920'
    },
    rate: {
      type: GraphQLInt,
      description: 'the customer rate for that command, int between 1 and 5'
    },
    comment: {
      type: GraphQLString,
      description: 'the customer comment for that command'
    }
  }
});


export const GraphQLUser: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLID,
      description: "user\'s id"
    },
    created: {
      type: GraphQLInt,
      description: "user\'s creation date"
    },
    updated: {
      type: GraphQLInt,
      description: "user update date"
    },
    firstName: {
      type: GraphQLString,
      description: 'the firstName of the user'
    },
    lastName: {
      type: GraphQLString,
      description: 'the lastName of the user'
    },
    mail: {
      type: GraphQLString,
      description: 'the mail of the user'
    },
    profilePicture: {
      type: GraphQLString,
      description: 'profile image url'
    },
    orders: {
      type: new GraphQLList(SimpleOrder),
      args: {
        pending: { type: GraphQLBoolean, description: 'only return pending orders (non treated)' },
        first: { type: GraphQLInt }
      },
      description: 'The orders of the user',
      resolve: (root: Object, args: { pending?: boolean, first?: number }, context: {}, {rootValue}: {rootValue: any}) => getUserOrders(args, rootValue)
    },
    restaurants: {
      type: new GraphQLList(GraphQLRestaurant),
      args: {
        first: { type: GraphQLInt }
      },
      description: 'The restaurants of the user',
      resolve: (root: Object, args: { first: number }, context: {}, {rootValue}: {rootValue: any}) => getUserRestaurants(rootValue)
    }
  }
});