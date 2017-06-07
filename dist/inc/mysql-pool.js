"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mysql = require("mysql");
const Promise = require("bluebird");
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
var pool = mysql.createPool(app_1.app.locals.config.db);
class MysqlPool {
    static getDisposerConnection() {
        return pool.getConnectionAsync().disposer(connection => {
            connection.release();
        });
    }
}
exports.MysqlPool = MysqlPool;
