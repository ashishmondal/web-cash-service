"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
//import { MysqlPool as db } from './mysql-pool';
const Promise = require("bluebird");
const crypto = require("crypto");
const https = require("https");
//enum command
var DmlQry;
(function (DmlQry) {
    DmlQry[DmlQry["Insert"] = 0] = "Insert";
    DmlQry[DmlQry["Update"] = 1] = "Update";
})(DmlQry = exports.DmlQry || (exports.DmlQry = {}));
;
;
;
/**
 * Function isEmptyObject
 *
 * @param  {Object} obj
 *
 * @returns boolean
 */
function isEmptyObject(obj) {
    for (var prop in obj) {
        return obj.hasOwnProperty(prop);
    }
    return true;
}
exports.isEmptyObject = isEmptyObject;
;
/**
 * Function getErrorTratament
 *
 * @param  {any} err
 *
 * @returns any
 */
//TODO: ver com carca ou bigous
function getErrorTratament(err) {
    try {
        let arrErr = err.stack.split('\n');
        let msg = '';
        let ret = {
            error_message: '',
            stack_trace: [],
        };
        let arrTratedErrors = [
            'Error: ER_BAD_NULL_ERROR: ',
            'Error: ER_NO_DEFAULT_FOR_FIELD: '
        ];
        for (let i = 0; i < arrTratedErrors.length; i++) {
            if (arrErr[0].indexOf(arrTratedErrors[i]) > -1) {
                msg = arrErr[0].substr(arrErr[0].indexOf(arrTratedErrors[i]) + arrTratedErrors[i].length);
            }
            ;
        }
        ;
        ret.error_message = msg !== '' ? msg : arrErr[0];
        if (app_1.app.locals.config.debug) {
            ret.stack_trace = arrErr;
        }
        ;
        return ret;
    }
    catch (error) {
        return err;
    }
}
exports.getErrorTratament = getErrorTratament;
;
/**
 * Function md5
 *
 * @param  {string} str
 *
 * @returns string
 */
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
exports.md5 = md5;
;
/**
 * function Funcgen.sha1
 *
 * @param  {string} str
 *
 * @returns string
 */
function sha1(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}
exports.sha1 = sha1;
;
/**
 * Verify if a var is set or not like PHP isset
 *
 * Example:
 * a = {
 *   b: {
 *     c: 'd'
 *   }
 * };
 * // Javascript
 * isset(function () { return a.b.c; }); // true
 * isset(function () { return a.z.c; }); // false
 * isset(function () { return a.b.z; }); // false
 * // Typescript
 * isset(() => a.b.c); // true
 * isset(() => a.z.c); // false
 * isset(() => a.b.z); // false
 *
 * @param  {Function} fn
 * @returns boolean
 *
 */
function isset(fn) {
    let value;
    try {
        value = fn();
    }
    catch (e) {
        value = undefined;
    }
    finally {
        return value !== undefined;
    }
}
exports.isset = isset;
function stringEncrypt(text, pass) {
    let cipher = crypto.createCipher('aes-256-ctr', pass);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
exports.stringEncrypt = stringEncrypt;
function stringDecrypt(text, pass) {
    let decipher = crypto.createDecipher('aes-256-ctr', pass);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
exports.stringDecrypt = stringDecrypt;
function getImageBase64(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            res.on('data', (d) => {
                let base64Image = new Buffer(d, 'binary').toString('base64');
                resolve('data:' + res.headers['content-type'] + ';base64,' + base64Image);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
exports.getImageBase64 = getImageBase64;
