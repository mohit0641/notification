const Joi = require('joi');
let UniversalFunctions = require('../Utils/UniversalFunctions');
let Config = require('../Config');
let formidable = require('formidable');
let fs = require('fs');
let logger = require('../Config/logger');
const nodemailer = require("nodemailer");
let smtpTransport = require('nodemailer-smtp-transport');
let Handlebars = require('handlebars');
let msg91 = require("msg91")("API_KEY", "SENDER_ID", "ROUTE_NO" );
const FCM = require('fcm-push');
const serverKey = 'AAAAj4z2mQ8:APA91bEtOf2pRX4OVsG03P7lvAeEykTdR38YwKq4kp_BwSZlRsRPshHhKzlCpD2HmGNb-9Bl9_jHp99OV1f88kDVSXaS9H8zTDKNdTm84fbNi6sVUKrcLMxldMxhC8xJUdATU71Kp7RT';
const fcm = new FCM(serverKey);

module.exports = [
    {
        method: 'POST',
        path: '/sendNotification',
        handler: async  (request, h) =>{
            let {min,hour,isSchedule,message,title,deviceToken,mobileNo,content,templateData,type,mediumType,subject,toEmail} = request.payload;
            try {
                let {notificationQueue} = require('../server');
                var cron= '';
                if(isSchedule === true){
                     cron =min+' '+hour+' * * *'
                }
                if(mediumType === 'EMAIL') {
                    let transporter = nodemailer.createTransport(smtpTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        auth: {
                            user: "test006411@gmail.com",
                            pass: '7889072087',
                        },
                    }));
                    let mailOptions ={
                        from: 'test006411@gmail.com',
                        to: toEmail,
                        subject: subject,
                    };

                    if(type === 'html'){
                        let template = Handlebars.compile(content);
                        mailOptions.html= (templateData)?(template(JSON.parse(templateData))):content;
                    }
                    else if(type === 'text'){
                        mailOptions.text=content
                    }
                    if(isSchedule === false){
                        let info = await transporter.sendMail(mailOptions);
                        console.log("Message sent: %s", info);
                    }
                    else {
                        notificationQueue.add({data:mailOptions,type:1},{ repeat: { cron: cron } })
                    }

                }
                else if(mediumType === 'SMS'){

                    if(isSchedule === false){
                        const data = await msg91.send(mobileNo, "MESSAGE");
                        console.log("__sms__",data);
                    }
                    else {
                        notificationQueue.add({data:mobileNo,type:2},{ repeat: { cron: cron } })

                    }
                }
                else if(mediumType === 'PUSH'){
                    let message = {
                        to: deviceToken,
                        // collapse_key: 'demo',
                        notification: {
                            title: title,
                            body: message,
                            badge:0,
                            click_action : 'OPEN_ACTIVITY_1'
                        },
                        data:{
                            "message": message,
                        },
                        priority: 'high'
                    };
                    if(isSchedule === false) {
                        const pushData = await fcm.send(message);
                        console.log("------pushData-----",pushData);

                    }
                    else {
                        notificationQueue.add({data:message,type:3},{ repeat: { cron: cron } })

                    }
                }
                return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,{})
            }
            catch (err) {
                console.log("==========",err);
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            tags: ['api', 'words'],
            validate: {
                payload: Joi.object({
                    mediumType : Joi.string().required().valid("EMAIL","SMS","PUSH"),
                    subject:Joi.string().description('key for email'),
                    content:Joi.string().description('key for email'),
                    type:Joi.string().valid('html','text'),
                    toEmail:Joi.array(),
                    templateData:Joi.string(),
                    mobileNo:Joi.array().description('key for email sms ith country code'),
                    deviceToken:Joi.array().description('key for push'),
                    title:Joi.string().description('key for push'),
                    message:Joi.string().description('key for push'),
                    isSchedule:Joi.boolean().valid(true,false).required(),
                    hour:Joi.number().min(0).max(23),
                    min:Joi.number().min(0).max(59)

                }),
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                      payloadType: 'form',
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
 ];


