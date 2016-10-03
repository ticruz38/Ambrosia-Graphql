import * as r from 'rethinkdb';

import * as e from 'express';

import { usersSeed } from './seeds/user';
import { restaurantSeed } from './seeds/restaurant';
import { orderSeed } from './seeds/order';


//imported cause some methods aren't typescript available
const rethinkdb = require('rethinkdb');

const config = {
  host: process.env.NODE_ENV === 'production'
    ? 'rethinkdb'
    : 'localhost',
  port: 28015,
  db: 'user'
};

export const createSecondaryIndex = (conn: r.Connection, {table, index}: {table: string, index: string}): Promise< r.CreateResult | Error > => {
  return new Promise((resolve, reject) => {
    r.table(table).indexCreate(index).run(conn, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
}

export const createTable = (conn: r.Connection, table:string): Promise< r.CreateResult | Error > => {
  return new Promise((resolve, reject) => {
    rethinkdb.tableCreate(table).run(conn, (err: Error, result: r.CreateResult) => {
      if (err && !err.message.match(/Table `.*` already exists/)) {
        console.log("Could not create the table " + table);
        console.log(err);
        reject(err);
        process.exit(1);
      }
      console.log('Table ' + table + ' created');
      resolve(result)
    });
  });
}

/** set tables up */
const setTablesUp = (conn: r.Connection): Promise< any[] >  => {
  return Promise.all([
    new Promise((resolve, reject) => {
      /**create restaurant table */
      createTable(conn, 'restaurant').then(value => {
        /**Create userID and location secondary indexes*/
        Promise.all([
          createSecondaryIndex(conn, { table: 'restaurant', index: 'userID' }),
          rethinkdb.table('restaurant').indexCreate('location', { geo: true }).run(conn)
        ]).then(values => resolve(values))
      });
    }),
    new Promise((resolve, reject) => {

      //create order tables
      createTable(conn, 'order').then(value => {
        
        // create userID and RestaurantID secondary indexes
        Promise.all([
          createSecondaryIndex(conn, { table: 'order', index: 'userID' }),
          createSecondaryIndex(conn, { table: 'order', index: 'restaurantID' })
        ]).then(values => resolve(values))
      });
    }),
    //create user table
    createTable(conn, 'user')
  ]);
}

export const connect = (): Promise< r.Connection > => {
  return new Promise((resolve, reject) => {
    r.connect(config, function (error: Error, conn: r.Connection) {
      if (error) {
        console.log('could not connect to rethinkdb', error);
        reject(error)
        process.exit(1);
      }
      resolve(conn);
    })
  })
} 

export const bootstrap = (cb: Function) => {
  r.connect(config, function (error: Error, conn: r.Connection) {
    if (error) {
      console.log('could not connect to rethinkdb', error);
      process.exit(1);
    } else {
      /**Check if the table user exists */
      r.table('user').run(conn, function (err: Error, result: any) {
        if (err) {
          r.dbCreate(config.db).run(conn, function (err, result) {
            if (err && !err.message.match(/Database `.*` already exists/)) {
              console.log("Could not create the database `" + config.db + "`");
              console.log(err);
              process.exit(1);
            }
            console.log('Database `' + config.db + '` created.');

            //set up our tables user, restaurant and order
            async function populate() {
              try {
                console.log('async function')
                // create 3 tables
                await setTablesUp(conn);
                //populate each of them
                await usersSeed(conn);
                console.log('userseed');
                await restaurantSeed(conn, [-122.4194200, 37.7749300]);
                console.log('restaurantSeed');
                await orderSeed(conn);
                console.log('orderSeed');
                cb();
                conn.close();
              }
              catch (err) {
                console.log('the database couldn\'t be populated!', err);
                process.exit(1);
              }
            }
            populate();
          })
        } else {
          //if database user allready exists, 
          //the app has allready been bootstrapped
          //call next()
          cb();
          conn.close()
        }
      })
    }
  });

}
  