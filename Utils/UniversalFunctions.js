let Config = require('../Config');
let Boom = require('boom');

let failActionFunction =  (request, reply, source, error) => {
    let customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation
    return reply(error);
};

let sendError = async  (data) => {

    let finalMessage = data.customMessage;
    if (typeof data === 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        finalMessage = data.customMessage;
        let errorToSend = new Boom(finalMessage,{statusCode:data.statusCode});
        errorToSend.output.payload.responseType = data.type;
        return errorToSend;
    }
    else {
        let errorToSend = '';
        if (typeof data === 'object') {
            if (data.name === 'MongoError') {
                errorToSend += Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                if (data.code = 11000) {
                    var duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
                    duplicateValue = duplicateValue.replace('}','');
                    errorToSend += Config.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
                    if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1')>-1){
                        errorToSend = Config.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
                    }
                }
            } else if (data.name === 'ApplicationError') {
                errorToSend += Config.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
            } else if (data.name === 'ValidationError') {
                errorToSend += Config.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
            } else if (data.name === 'CastError') {
                errorToSend += Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage + Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
            }
        }
        else {
            errorToSend = data
        }
        let customErrorMessage = errorToSend;
        if (typeof customErrorMessage === 'string'){
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
        }
        return new Boom(customErrorMessage,{statusCode:400})
    }
};

let sendSuccess = async  (successMsg, data)=> {
    successMsg = successMsg || Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg === 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode:successMsg.statusCode, message: successMsg.customMessage.en, data: data || null};

    }else {
        return {statusCode:200, message: successMsg, data: data || null};

    }
};

module.exports = {
    sendError:sendError,
    sendSuccess:sendSuccess,
    failActionFunction: failActionFunction,
};