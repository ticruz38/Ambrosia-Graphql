/* use with node 6.5.0*/

import * as graphql from 'graphql';
import * as graphqlHTTP from 'express-graphql';
import * as express from 'express';
import * as cors from 'cors';
import * as root from './graphql-api/query/root'

import { bootstrap, connect } from './rethinkdb/bootstrap';

const r = require('rethinkdb');

const schema = new graphql.GraphQLSchema({
  query: root.queryType
});

const app = express();

app.options('/graphql', cors())
  .use('/graphql', cors(), async function graphQl(req, res) {
      const conn = await connect()
      const graph = await graphqlHTTP({
        schema: schema,
        graphiql: true,
        pretty: true,
        rootValue: { conn: conn }
      })(req, res);
      //conn.close()
      return graph;
  }
);
// checkout if database is populated
bootstrap(function () {
  console.log('app is listening on port 3800');
  app.listen(3800);
})
