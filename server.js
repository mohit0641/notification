'use strict';

const Hapi = require('@hapi/hapi');
let Plugins = require('./Plugins');
let mongoose = require('mongoose');
let Routes = require('./Routes');
let logger = require('./Config/logger');
let Queue = require('bull');

(async () => {
    try {

        const server = Hapi.Server({
            app: {
                name: "Notification Service"
            },
            port: 8000,
            routes: {cors: true}
        });

        //await mongoose.connect("mongodb://localhost:27017/cattle", {useFindAndModify:false,useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex:true});
        //logger.info('MongoDB Connected');

        server.route(
            [
                {
                    method: 'GET',
                    path: '/',
                    handler:  (req, h) =>{
                        //TODO Change for production server
                        return h.view('index')

                    }
                },
            ]
        );
        await server.register(Plugins);

        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './Views'
        });

        server.route(Routes);

        await server.start();

        logger.log('info','Server running at %s', server.info.uri);

        let notificationQueue = new Queue('schedule notification', {
            redis: {
                host: '127.0.0.1',
                port: 6379,
            }
        });

        notificationQueue.process(async job => {
            console.log("out",job.data);
            await notificationfunc(job.data)
        });

        module.exports={
            notificationQueue:notificationQueue,
            server:server
        }

    }
    catch (err) {
        logger.log("error","====================", err);
        process.exit(1);
    }
})();


let notificationfunc = async (variable) => {
    let {type, data} = variable;
    if (type === 1) {
        const nodemailer = require("nodemailer");
        let smtpTransport = require('nodemailer-smtp-transport');
        let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: "test006411@gmail.com",
                pass: '7889072087',
            },
        }));
        let info = await transporter.sendMail(data);

        console.log("Message sent: %s", info);

    }
    else if (type === 2) {
        let msg91 = require("msg91")("API_KEY", "SENDER_ID", "ROUTE_NO");
        const data1 = await msg91.send(data, "MESSAGE");
        console.log("__sms__", data1);

    }
    else if (type === 3) {
        const FCM = require('fcm-push');
        const serverKey = 'AAAAj4z2mQ8:APA91bEtOf2pRX4OVsG03P7lvAeEykTdR38YwKq4kp_BwSZlRsRPshHhKzlCpD2HmGNb-9Bl9_jHp99OV1f88kDVSXaS9H8zTDKNdTm84fbNi6sVUKrcLMxldMxhC8xJUdATU71Kp7RT';
        const fcm = new FCM(serverKey);
        const pushData = await fcm.send(data);
        console.log("------pushData-----", pushData);


    }
};