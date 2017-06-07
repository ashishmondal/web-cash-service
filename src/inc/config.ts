import { app } from './app';
import { IConnectionConfig } from "mysql";

export class Config {
	public hosts: string[];
	public debug: boolean;
	public apiVersion: string;
	public dateFormat: string;
	public dateTimeFormat: string;
	public tokenSecret: string;
	public encryptPass: string;
	db: IConnectionConfig;

	public static jsonConfig: { [key: string]: Config } = {
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

	public static getConfig(env?: string) {
		return this.jsonConfig[env || app.locals.environment];
	};

	public static isValidHost(hostname: string) {
		return this.jsonConfig[app.locals.environment].hosts.indexOf(hostname) === -1;
	};

}
