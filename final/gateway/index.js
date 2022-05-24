const { createServer } = require("@graphql-yoga/node");
const { loadSchema } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { addResolversToSchema } = require("@graphql-tools/schema");
const { stitchSchemas } = require("@graphql-tools/stitch");

const { introspectSchema } = require("@graphql-tools/wrap");
const { fetch } = require("cross-undici-fetch");
const { print } = require("graphql");

const ReviewsAPI = require("./../review/datasources/ReviewsAPI");
const reviewsResolvers = require("./../review/resolvers.js");

async function remoteExecutor({ document, variables }) {
  const query = print(document);
  const fetchResult = await fetch("http://0.0.0.0:4002/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return fetchResult.json();
}

async function main() {
  const reviewsSchema = await loadSchema("./../review/reviews.graphql", {
    loaders: [new GraphQLFileLoader()],
  });

  const reviewsSchemaWithResolvers = addResolversToSchema({
    schema: reviewsSchema,
    resolvers: reviewsResolvers,
  });
  const reviewsSubschema = {
    schema: reviewsSchemaWithResolvers,
    merge: {
      Book: {
        selectionSet: "{ isbn }",
        fieldName: "reviewsForBook",
        args: ({ isbn }) => ({ isbn }),
      },
    },
  };

  const booksSubschema = {
    schema: await introspectSchema(remoteExecutor),
    executor: remoteExecutor,
    merge: {
      Book: {
        selectionSet: "{ isbn }",
        fieldName: "book",
        args: ({ isbn }) => ({ isbn }),
      },
    },
  };

  const gatewaySchema = stitchSchemas({
    subschemas: [booksSubschema, reviewsSubschema],
  });

  const server = createServer({
    context: () => {
      return {
        dataSources: {
          reviewsAPI: new ReviewsAPI(),
        },
      };
    },
    schema: gatewaySchema,
    port: 4003,
  });

  await server.start();
}

main().catch((error) => console.error(error));
