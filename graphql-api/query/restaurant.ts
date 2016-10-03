import {GraphQLBoolean,
        GraphQLID,
        GraphQLString,
        GraphQLInt,
        GraphQLFloat,
        GraphQLObjectType,
        GraphQLInputObjectType,
        GraphQLList} from 'graphql'

import * as graphql from 'graphql'

import {GraphQLLocation} from './location';
import {GraphQLOrder} from './order';

//api
import {getRestaurant, getRestaurantAverageScore, getRestaurantComments, getRestaurantReviewsCount,
        getRestaurantOrders, getRestaurants} from '../../api/restaurant';

const GraphQLOpenHours = new GraphQLObjectType({
  name: 'OpenHours',
  fields: {
    from: {type: GraphQLInt, description: 'in milliseconds since midnight of that day'},
    to: {type: GraphQLInt, description: 'in milliseconds since midnight of that day'}
  }
});

const GraphQLInputOpenHours = new GraphQLInputObjectType({
  name: 'InputOpenHours',
  fields: {
    from: {type: GraphQLInt, description: 'in milliseconds since midnight of that day'},
    to: {type: GraphQLInt, description: 'in milliseconds since midnight of that day'}
  }
});

export const GraphQLDay = new GraphQLObjectType({
  name: 'Day',
  fields: {
    day: {
      type: GraphQLString,
      description: 'day of the week'
    },
    openHours: {
      type: new GraphQLList(GraphQLOpenHours)
    }
  }
});

export const GraphQLInputDay = new GraphQLInputObjectType({
  name: 'InputDay',
  fields: {
    day: {
      type: GraphQLString,
      description: 'day of the week'
    },
    openHours: {
      type: new GraphQLList(GraphQLInputOpenHours)
    }
  }
});

const GraphQLReviews = new GraphQLObjectType({
  name: 'Reviews',
  fields: {
    averageScore: {
      type: GraphQLFloat,
      description: 'the restaurant average score from all reviews',
      resolve: ({id}, {}, context, {rootValue}) => getRestaurantAverageScore(id, rootValue)
    },
    comments: {
      type: new GraphQLList(GraphQLString),
      description: 'list of customers reviews/comments',
      resolve: ({id}, {}, context, {rootValue}) => getRestaurantComments(id, rootValue)
    },
    count: {
      type: GraphQLInt,
      description: 'rates number',
      resolve: ({id}, {}, context, {rootValue}) => getRestaurantReviewsCount(id, rootValue)
    }
  }
});

export const GraphQLMeal = new GraphQLObjectType({
  name: 'Meal',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    price: {
      type: GraphQLFloat
    },
    time: {
      type: GraphQLFloat
    }
  }
});

export const GraphQLInputMeal = new GraphQLInputObjectType({
  name: 'InputMeal',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    price: {
      type: GraphQLFloat
    },
    time: {
      type: GraphQLFloat
    }
  }
});

export const GraphQLFood = new GraphQLObjectType({
  name: 'Food',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    picture: {
      type: new GraphQLObjectType({
        name: 'Picture',
        fields: {
          url: {
            type: GraphQLString,
            description: 'picture url'
          },
          size: {
            type: new GraphQLList(GraphQLInt),
            description: 'image size'
          },
        }
      }),
      description: 'restaurant\'s picture'
    },
    meals: {
      type: new GraphQLList(GraphQLMeal),
      description: 'List of meals'
    }
  }
});

export const GraphQLInputFood = new GraphQLInputObjectType({
  name: 'InputFood',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    picture: {
      type: GraphQLString,
      description: 'restaurant\'s picture'
    },
    meals: {
      type: new GraphQLList(GraphQLInputMeal),
      description: 'List of meals'
    }
  }
});

export const GraphQLRestaurant: GraphQLObjectType = new GraphQLObjectType({
  name: 'Restaurant',
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
    foods: {
      type: new GraphQLList(GraphQLFood),
      description: 'List of foods'
    },
    id: {
      type: GraphQLID,
    },
    location: {
      type: GraphQLLocation,
      description: 'the restaurant location object'
    },
    orders: {
      type: new GraphQLList(GraphQLOrder),
      args: {
        midnightTime:{
          type: GraphQLFloat,
          description: 'only require order of the day'
        },
        first: {
          type: GraphQLInt
        }
      },
      description: 'all the restaurants orders',
      resolve: ({id}, {midnightTime, first}, context, {rootValue}) => getRestaurantOrders({id, midnightTime, first}, rootValue)
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
      type: new GraphQLObjectType({
        name: 'Picture',
        fields: {
          url: {
            type: GraphQLString,
            description: 'picture url'
          },
          size: {
            type: new GraphQLList(GraphQLInt),
            description: 'image size'
          },
        }
      }),
    description: 'restaurant\'s picture'
    },
    reviews: {
      type: GraphQLReviews,
      description: 'restaurant score',
      resolve: (restaurant) => restaurant
    },
    schedule: {
      type: new GraphQLList(GraphQLDay),
      description: 'restaurant schedule on a week basis'
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
});

export const GraphQLInputRestaurant = new GraphQLInputObjectType({
  name: 'InputRestaurant',
  fields: {
    busy: {
      type: GraphQLInt,
      description: 'time needed to treat coming orders in milliseconds'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    foods: {
      type: new GraphQLList(GraphQLInputFood),
      description: 'List of foods'
    },
    id: {
      type: GraphQLString
    },
    location: {
      type: new GraphQLList(GraphQLFloat),
      description: 'restaurant latitude and longitude'
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    open: {
      type: GraphQLBoolean,
      description: 'is your restaurant open'
    },
    picture: {
      type: GraphQLString,
      description: 'restaurant\'s picture'
    },
    schedule: {
      type: new GraphQLList(GraphQLInputDay),
      description: 'restaurant schedule on a week basis'
    },
    scorable: {
      type: GraphQLBoolean,
      description: 'is restaurant scorable'
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'Restaurant\'s tags'
    }
  }
});