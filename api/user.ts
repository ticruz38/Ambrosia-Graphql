var r = require('rethinkdb');

import { rootValue, PromiseResult, toArrayPromiseResult } from './utils';

interface rootValue {
  conn: Object,
  cookies?: {
    get: (string: string) => any;
  }
};

export function getUser(rootValue: rootValue): Object | Promise<Object> {
  if (!rootValue.cookies.get('userID')) return { name: '', mail: '' };
  const query = r.table('user').get(rootValue.cookies.get('userID'));
  return PromiseResult(query, rootValue);
}

export function getUserByID(id: string, rootValue: rootValue) {
  let query = r.table('user').get(id)
  return PromiseResult(query, rootValue);
}

export function getUserRestaurants(rootValue: rootValue):Promise<Object[]> | Object[] {
  if (!rootValue.cookies.get('userID')) return [];
    const query = r.table('restaurant').getAll(rootValue.cookies.get('userID'), {
      index: 'userID'
    });
  return toArrayPromiseResult(query, rootValue);
}

export function getUserOrders(args: {pending?: boolean, first?: number}, rootValue: rootValue): Promise<Object[]> | Object[] {
  if (!rootValue.cookies.get('userID')) return [];
  let query = r.table('order').getAll(rootValue.cookies.get('userID'), {index: 'userID'}).orderBy(r.desc('date'))
  if(args.pending) {
    query = query.filter((order: Object & {treated: boolean}) => order.treated === false)
  }
  if(args.first) {
    query.limit(args.first)
  }
  return toArrayPromiseResult(query, rootValue);
}