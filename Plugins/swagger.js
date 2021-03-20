'use strict';

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

const HapiSwagger = require('hapi-swagger');
//Register Swagger
let Pack = require('../package');
let logger = require('../Config/logger');


module.exports.swaggerPlugin = {
    name: 'swagger-plugin',
    register: async  (server, options)=> {
        try {
            const swaggerOptions = {
                info: {
                    'title': "Notification service API's",
                    'version': Pack.version,
                },
            };
            await server.register([
                Inert,
                Vision,
                // Blipp,
                {
                    'plugin': HapiSwagger,
                    'options': swaggerOptions
                }

            ]);
            logger.log('info', 'Swagger Plugins Loaded')
        }
        catch (err) {
            logger.error('Error while loading plugins : ' + err)
        }
    }
};
/*
exports.register.attributes = {
    name: 'swagger-plugin'
};*/
