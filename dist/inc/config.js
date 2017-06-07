"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
class Config {
    static getConfig(env) {
        return this.jsonConfig[env || app_1.app.locals.environment];
    }
    ;
    static isValidHost(hostname) {
        return this.jsonConfig[app_1.app.locals.environment].hosts.indexOf(hostname) === -1;
    }
    ;
}
Config.jsonConfig = {
    dev: {
        hosts: ['127.0.0.1', 'localhost'],
        debug: true,
        apiVersion: 'v1.0',
        dateFormat: 'YYYY-MM-DD',
        dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
        tokenSecret: 'devTokenSecret',
        encryptPass: 'devTokenPass',
        db: {
            host: 'localhost',
            user: 'ashish',
            password: 'ysibwysn',
            database: 'gnucash',
            port: 3307
        }
    },
    hml: {
        hosts: ['hmlapi.yourdomain.com', '127.0.0.1', 'localhost'],
        debug: true,
        apiVersion: 'v1.0',
        dateFormat: 'YYYY-MM-DD',
        dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
        tokenSecret: 'hmlTokenSecret',
        encryptPass: 'hmlTokenPass',
        db: {
            host: '127.0.0.1',
            user: 'mysql_user',
            password: 'mysql_pass',
            database: 'mysql_db'
        }
    },
    prod: {
        hosts: ['api.yourdomain.com', '127.0.0.1', 'localhost'],
        debug: false,
        apiVersion: 'v1.0',
        dateFormat: 'YYYY-MM-DD',
        dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
        tokenSecret: 'prodTokenSecret',
        encryptPass: 'prodTokenPass',
        db: {
            host: '127.0.0.1:3342',
            user: 'mysql_user',
            password: 'mysql_pass',
            database: 'mysql_db'
        }
    },
};
exports.Config = Config;
