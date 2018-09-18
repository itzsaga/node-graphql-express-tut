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

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
  },
  2: {
    id: '2',
    text: 'Bye World',
  },
};

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
  }

  type Message {
    id: ID!
    text: String!
  }
`;

const resolvers = {
  Query: {
    users: () => Object.values(users),
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    messages: () => Object.values(messages),
    message: (parent, { id }) => messages[id]
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
