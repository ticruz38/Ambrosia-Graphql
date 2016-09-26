import * as r from 'rethinkdb';

var rethinkdb = require('rethinkdb');


import {hashPassword} from '../../api/utils';

var users = (password: string) => [{name: 'Pablo', mail: 'pablo@gmail.com', password: password}, {name: 'Martine', mail: 'martine@gmail.com', password: password}, {name: 'JeanChat', mail: 'jeanchat@gmail.com', password: password}, {name: 'Locat', mail: 'locat@gmail.com', password: password}, {name: 'Duduche', mail: 'duduche@gmail.com', password: password}, {name: 'Totto', mail: 'totto@gmail.com', password: password}, {name: 'Couchou', mail: 'couchou@gmail.com', password: password}, {name: 'Adrien', mail: 'adrien@gmail.com', password: password}];

/**
 *create random users, this is used as a middleware by the server, passing in the rethinkdb connection
 */
export const usersSeed = (conn: r.Connection) => {
  return new Promise((resolve, reject) => {
    // all users will get same password
    hashPassword('Ambrosia68').then((password: string) => {
      return r.table('user').insert(users(password)).run(conn, (err, res) => {
        if (err) {
          console.log('error inserting new user');
          process.exit(1);
        }
        resolve(res);
      });
    });
  });
}
