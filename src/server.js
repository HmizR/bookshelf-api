const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server(
        {
            port: 9000,
            host: '0.0.0.0',
        },
    );

    server.route(routes);
    await server.start();
    console.log(`Server runs on ${server.info.uri}`);
};

init();
