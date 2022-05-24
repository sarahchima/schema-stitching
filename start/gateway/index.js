const { createServer } = require( '@graphql-yoga/node');

async function main()  {
    const server = createServer({
    })

    await server.start()
}

main().catch(error => console.error(error))