const r = require("rethinkdb");

//utils
import {PromiseResult, toArrayPromiseResult, PromiseUpdateResult} from './utils';

interface rootValue {
  conn: Object,
  cookies?: {
    get: (string: string) => any;
  }
};

let restaurantsQuery = r.table('restaurant');
let nearestRestaurantQuery = (location : number[] )  => {
  return restaurantsQuery.getNearest(r.point(location[0], location[1]), {
      index: 'location',
      maxResults: 1000,
      maxDist: 5500000
    }).merge((row: any) => {
      return {doc: {distance: row('dist') }}
    })
}

export function getRestaurants(args: {location?: number[], name?: string, open?: string, sort?: string, filter?: string[], count?: number}, rootValue: rootValue) {
  if (args.location) nearestRestaurantQuery(args.location).map((row: any) => row('doc'));
  if (args.name) {
    restaurantsQuery = restaurantsQuery.filter((restaurant: any) => {
      return restaurant('name').match(args.name)
    });
  }
  if (args.open) {
    restaurantsQuery = restaurantsQuery.filter({
      open: true
    });
  }
  if(args.sort) {
    switch(args.sort) {
      case "popularity":
        //TODO order by the number of order
        restaurantsQuery = restaurantsQuery.orderBy(r.row('reviews')('count'));
        break;
      case "rated":
        restaurantsQuery = restaurantsQuery.orderBy(r.row('reviews')('averageScore'));
        break;
      case "distance":
        restaurantsQuery = restaurantsQuery.orderBy("distance");
        break;
      default:
        //nothing here
    }
  }
  if(args.filter) {
    restaurantsQuery = restaurantsQuery.filter((restaurant: any) => {
      return restaurant('name').match(args.filter[0])
    });
    for (var i = 1; i < args.filter.length; i++) {
      switch (args.filter[i]) {
        case "open":
          restaurantsQuery = restaurantsQuery.filter({open: true});
        default:
         //nothing here yet
      }
    }
  }
  if(args.count) restaurantsQuery.limit(args.count);

  return toArrayPromiseResult(restaurantsQuery, rootValue);
}

export const getRestaurant = (id: string, rootValue: rootValue) => PromiseResult(restaurantsQuery.get(id), rootValue);

export function getRestaurantOrders(args: {id: string, midnightTime?: number, first?: number}, rootValue: rootValue) {
  const dayEnd: number = args.midnightTime + 24*60*60*1000;
  let query = r.table('order').getAll(args.id, {index: 'restaurantID'})
  if (args.midnightTime) {
    query = query.filter(r.row("date").gt(args.midnightTime).and(r.row("date").lt(dayEnd)))
  }
  query = query.orderBy('date');
  if(args.first) query = query.limit(args.first)
  return PromiseResult(query, rootValue);
}

export function updateRestaurant(restaurant: Object & {id: string}, rootValue: rootValue) {
  let query = r.table('restaurant').get(restaurant.id).update(restaurant, { returnChanges: true });
  return PromiseUpdateResult(query, rootValue);
}

export function getRestaurantAverageScore(id: string, rootValue: rootValue) {
  let query = r.table('order').getAll(id, {index: 'restaurantID'}).avg('rate');
  return PromiseResult(query, rootValue);
}

export function getRestaurantComments(id: string, rootValue: rootValue) {
  let query = r.table('order').getAll(id, {index: 'restaurantID'}).getField('comment');
  return toArrayPromiseResult(query, rootValue);
}

export function getRestaurantReviewsCount(id: string, rootValue: rootValue) {
  let query = r.table('order').getAll(id, {index: 'restaurantID'}).getField('rate').count();
  return PromiseResult(query, rootValue);
}



