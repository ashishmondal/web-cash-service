import { app } from './app';
import * as mysql from 'mysql';
import * as Promise from 'bluebird';

Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

var pool =
	 mysql.createPool(
		app.locals.config.db
	);

export class MysqlPool {

	static getDisposerConnection() {
		return (<any>pool).getConnectionAsync().disposer(connection => {
			connection.release();
		});
	}

}
