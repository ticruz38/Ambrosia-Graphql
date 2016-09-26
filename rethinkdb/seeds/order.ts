import * as r from 'rethinkdb';

const rethinkdb = require('rethinkdb');

import {
  fakeOrders
} from './json/order';

export const getIDs = (conn: r.Connection, table: string): Promise < string[] > => {
  return new Promise((resolve, reject) => {
    rethinkdb.table(table)('id').run(conn, (err: Error, result: r.Cursor) => {
      if (err) {
        console.error('rethinkdb can\'t access ' + table + 'ID, the table may be empty', err);
        process.exit(1);
      }
      result.toArray((err: Error, result: string[]) => {
        resolve(result);
      });
    });
  })
}

/**
 * 3rd table to be poppulate, to be populate after user and restaurant tables
 * Populate the order table with fakeOrders
 */
export const orderSeed = (conn: r.Connection): Promise<any[]> => {
  //get all restaurant and user ids
  const promises: Promise < r.CreateResult > [] = [];
  Promise.all([
    getIDs(conn, 'restaurant'),
    getIDs(conn, 'user')
  ]).then((values: string[][]): void => {
    // iterate over each restaurant, generate a bunch of orders
    values[0].forEach((restaurantID: string, i: number) => {
      const orders = fakeOrders(restaurantID, values[1]);
      promises.push(new Promise((resolve, reject) => {
        r.table('order').insert(orders).run(conn, function(err, res) {
          if (err) {
            console.log('rethinkdb can\'t insert orders', err);
            process.exit(1);
          }
          resolve(res);
        });
      }))
    });
  });
  return Promise.all(promises)
};