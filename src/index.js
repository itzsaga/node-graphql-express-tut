import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

let users = {
  1: {
    id: "1",
    username: "John Doe",
    messageIds: [1]
  },
  2: {
    id: "2",
    username: "Jane Smith",
    messageIds: [2]
  }
};

let messages = {
  1: {
    id: "1",
    text: "Hello World",
    userId: "1"
  },
  2: {
    id: "2",
    text: "Bye World",
    userId: "2"
  }
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
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

const resolvers = {
  Query: {
    users: () => Object.values(users),
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    messages: () => Object.values(messages),
    message: (parent, { id }) => messages[id]
  },
  User: {
    messages: user =>
      Object.values(messages).filter(message => message.userId === user.id)
  },
  Message: {
    user: message => users[message.userId]
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
