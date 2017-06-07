import { app } from './app';
//import { MysqlPool as db } from './mysql-pool';
import * as Promise from 'bluebird';
import * as crypto from 'crypto';
import * as https from 'https';

//enum command
export enum DmlQry { 'Insert', 'Update' };


export interface IQueryResult {
	rows: any;
	fields?: any;
	message?: any;
};

export interface IQueryCommand {
	sql: string;
	val: Array<any>;
};

/**
 * Function isEmptyObject
 *
 * @param  {Object} obj
 *
 * @returns boolean
 */
export function isEmptyObject(obj: Object): boolean {
	for (var prop in obj) {
		return obj.hasOwnProperty(prop);
	}
	return true;
};

/**
 * Function getErrorTratament
 *
 * @param  {any} err
 *
 * @returns any
 */
//TODO: ver com carca ou bigous
export function getErrorTratament(err: any): any {
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
			};
		};
		ret.error_message = msg !== '' ? msg : arrErr[0];
		if (app.locals.config.debug) {
			ret.stack_trace = arrErr;
		};
		return ret;
	} catch (error) {
		return err;
	}
};

/**
 * Function md5
 *
 * @param  {string} str
 *
 * @returns string
 */
export function md5(str: string): string {
	return crypto.createHash('md5').update(str).digest('hex');
};

/**
 * function Funcgen.sha1
 *
 * @param  {string} str
 *
 * @returns string
 */
export function sha1(str: string): string {
	return crypto.createHash('sha1').update(str).digest('hex');
};

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
export function isset(fn: Function): boolean {
	let value;
	try {
		value = fn();
	} catch (e) {
		value = undefined;
	} finally {
		return value !== undefined;
	}
}

export function stringEncrypt(text: string, pass: string): string {
	let cipher = crypto.createCipher('aes-256-ctr', pass);
	let crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

export function stringDecrypt(text: string, pass: string): string {
	let decipher = crypto.createDecipher('aes-256-ctr', pass);
	let dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

export function getImageBase64(url: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		https.get(url, (res) => {
			res.on('data', (d: string) => {
				let base64Image = new Buffer(d, 'binary').toString('base64');
				resolve('data:' + res.headers['content-type'] + ';base64,' + base64Image);
			});
		}).on('error', (err) => {
			reject(err);
		});
	});
}
