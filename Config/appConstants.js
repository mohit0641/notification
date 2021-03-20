'use strict';

let swaggerDefaultResponseMessages = [
    {code: 200, message: 'OK'},
    {code: 400, message: 'Bad Request'},
    {code: 401, message: 'Unauthorized'},
    {code: 404, message: 'Data Not Found'},
    {code: 500, message: 'Internal Server Error'}
];

let STATUS_MSG = {
    ERROR: {
        SOMETHING_WENT_WRONG: {
            statusCode:400,
            type: 'SOMETHING_WENT_WRONG',
            customMessage :'Something went wrong on server.'
        },
        DB_ERROR: {
            statusCode: 400,
            customMessage:'DB Error : ',
            type: 'DB_ERROR'
        },
        DUPLICATE: {
            statusCode: 400,
            customMessage:'Duplicate Entry',
            type: 'DUPLICATE'
        },
        DUPLICATE_ADDRESS: {
            statusCode: 400,
            customMessage: 'Address Already Exist',
            type: 'DUPLICATE_ADDRESS'
        },
        APP_ERROR: {
            statusCode: 400,
            customMessage: 'Application Error',
            type: 'APP_ERROR'
        },
        INVALID_ID: {
            statusCode: 400,
            customMessage: 'Invalid Id Provided : ',
            type: 'INVALID_ID'
        },
    },
    SUCCESS: {
        DEFAULT: {
            statusCode: 200,
            customMessage:"Success",
            type: 'DEFAULT'
        },
    }
};


module.exports = {
    swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
    STATUS_MSG:STATUS_MSG

};
