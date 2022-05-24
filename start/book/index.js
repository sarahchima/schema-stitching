const { loadSchema } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { addResolversToSchema } = require("@graphql-tools/schema");

const { createServer } = require("@graphql-yoga/node");

const BooksAPI = require("./datasources/BooksAPI");
const booksResolvers = require("./resolvers.js");

async function main() {
  const booksSchema = await loadSchema("./books.graphql", {
    loaders: [new GraphQLFileLoader()],
  });

  const booksSchemaWithResolvers = addResolversToSchema({
    schema: booksSchema,
    resolvers: booksResolvers,
  });

  // build the combined schema
  const server = createServer({
    context: () => {
      return {
        dataSources: {
          booksAPI: new BooksAPI(),
        },
      };
    },
    schema: booksSchemaWithResolvers,
    port: 4002,
  });

  await server.start();
}

main().catch((error) => console.error(error));
