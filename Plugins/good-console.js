'use strict';

/*
var Good = require('good');
*/

//Register Good Console
let logger = require('../Config/logger');

exports.register = async (server, options,)=>{
    try {
        await server.register({
            plugin: require('@hapi/good'),
            options: {
                ops: {
                    interval: 6000000 // 10 mins
                },
                reporters: {
                    myConsoleReporter: [
                        {
                            module: '@hapi/good-squeeze',
                            name: 'Squeeze',
                            args: [{log: '*', response: '*', ops: '*'}]
                        },
                        {
                            module: '@hapi/good-console'
                        },
                        'stdout'
                    ]
                }
            }
        });
        logger.log('info','Good Console Plugins Loaded')

    }
    catch(err) {
        logger.error('Error while loading plugins : ' + err)
    }

};

/*
exports.register.attributes = {
    name: 'good-console-plugin'
};*/

exports.name = 'good-console-plugin'