import {
        GraphQLID,
        GraphQLString,
        GraphQLInt,
        GraphQLFloat,
        GraphQLBoolean,
        GraphQLList,
        GraphQLObjectType,
        GraphQLInterfaceType,
        GraphQLInputObjectType
      }                         from 'graphql';



import {GraphQLRestaurant}      from './restaurant';

//api
import {getRestaurant}          from '../../api/restaurant';
import {getUserByID}            from '../../api/user';

export var GraphQLItem = new GraphQLObjectType({
  name: 'Item',
  fields: {
    id: {
      type: GraphQLString
    },
    parent: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  }
});

export const GraphQLInputItem = new GraphQLInputObjectType({
  name: 'InputItem',
  fields: {
    id: {
      type: GraphQLString
    },
    parent: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  }
});

const SimpleRestaurant = new GraphQLObjectType({
  name: 'SimpleRestaurant',
  description: '',
  fields: {
    busy: {
      type: GraphQLInt,
      description: 'time needed to treat coming orders in minutes'
    },
    created: {
      type: GraphQLInt,
      description: 'Creation time'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    distance: {
      type: GraphQLFloat,
      description: 'distance between the user and the restaurant'
    },
    id: {
      type: GraphQLID,
    },
    open: {
      type: GraphQLBoolean,
      description: 'is your restaurant open'
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    picture: {
      type: GraphQLString,
      description: 'restaurant\'s picture'
    },
    scorable: {
      type: GraphQLBoolean,
      description: 'is the restaurant scorable'
    },
    userID: {
      type: GraphQLString,
      description: 'userID of the owner'
    }
  }
})

export const SimpleUser = new GraphQLInterfaceType({
  name: 'SimpleUser',
  description: 'the simple user possible without neither order or restaurants',
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
  }
})

export const GraphQLOrder: GraphQLObjectType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: {
      type: GraphQLID
    },
    userID: {
      type: GraphQLID,
      description: 'Order user id'
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
    },
    user: {
      type: SimpleUser,
      description: 'user orderer',
      resolve: (root: any, args: {}, context: {}, { rootValue }: { rootValue: any }) => getUserByID(root.userID, rootValue)
    },
    restaurant: {
      type: SimpleRestaurant,
      description: 'restaurant name for that particular order',
      resolve: (root: any, args: {}, context: {}, { rootValue }: { rootValue: any }) => getRestaurant(root.restaurantID, rootValue)
    }
  }
});

export var GraphQLInputOrder = new GraphQLInputObjectType({
  name: 'InputOrder',
  fields: {
    comment: {
      type: GraphQLString,
      description: 'customer commentary, next to the rate'
    },
    created: {
      type: GraphQLFloat,
      description: 'the time in milliseconds by which the order has been done since january 1920'
    },
    id: {
      type: GraphQLString
    },
    items: {
      type: new GraphQLList(GraphQLInputItem),
      description: 'the items in that order'
    },
    message: {
      type: GraphQLString,
      description: 'a message along the order'
    },
    payed: {
      type: GraphQLBoolean,
      description:  'is the order payed'
    },
    prepayed: {
      type: GraphQLBoolean,
      description: 'is the order payed?'
    },
    price: {
      type: GraphQLFloat,
      description: 'the order value, expressed with an integer'
    },
    rate: {
      type: GraphQLInt,
      description: 'the order customer rate'
    },
    restaurantID: {
      type: GraphQLString,
      description: 'the restaurant who get ordered'
    },
    treated: {
      type: GraphQLBoolean,
      description: 'is the order treated'
    },
    userID: {
      type: GraphQLString,
      description: 'the orderer user-id'
    },
    userName: {
      type: GraphQLString,
      description: 'the orderer user-name'
    },     
  }
});