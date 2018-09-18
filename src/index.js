import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

let users = {
  1: {
    id: "1",
    username: "John Doe"
  },
  2: {
    id: "2",
    username: "Jane Smith"
  }
};

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }

  type User {
    id: ID!
    username: String!
  }
`;

const resolvers = {
  Query: {
    users: () => Object.values(users),
    user: (parent, { id }) => users[id],
    me: (parent, args, { me }) => me
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
