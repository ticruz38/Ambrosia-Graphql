/* use with node 6.5.0*/
// Import the required libraries
import * as graphql from 'graphql';
import * as graphqlHTTP from 'express-graphql';
import * as express from 'express';

import * as root from './graphql-api/query/root'

// Define the schema with one top-level field, `user`, that
// takes an `id` argument and returns the User with that ID.
// Note that the `query` is a GraphQLObjectType, just like User.
// The `user` field, however, is a userType, which we defined above.
const schema = new graphql.GraphQLSchema({
  query: root.queryType
});

express()
  .use('/graphql', graphqlHTTP({ schema: schema, graphiql: true, pretty: true }))
  .listen(3000);

console.log('GraphQL server running on http://localhost:3000/graphql');
