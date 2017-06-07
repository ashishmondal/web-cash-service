import { createConnection, IConnection } from 'mysql';

import { IDataService } from "../data-service";
import { Config } from "../../inc/config";
import { Observable } from "rxjs/Observable";
import { IAccount, IAccountInfo } from "../data-models";
import { Observer } from "rxjs/Observer";
import { Account, IAccountTable, AccountInfo } from "./data-models";

import "rxjs/add/operator/map";

export class DataService implements IDataService {
	private connection: IConnection;

	constructor(configuration: Config) {
		this.connection = createConnection(configuration.db);
	}

	getAccount(): Observable<IAccount> {
		return this.queryData<IAccountTable[]>('SELECT * from accounts')
			.map(accountTables => Account.parse(accountTables).getJson());
	}

	getSubAccounts(parentId: string): Observable<IAccountInfo[]> {
		const condition = parentId === 'NULL' ? ' is null' : `="${parentId}"`;
		const query = 'select * from accounts where accounts.parent_guid' + condition;

		return this.queryData<IAccountTable[]>(query)
			.map(accountTables => accountTables.map(at => new AccountInfo(at)));
	}

	getSubAccountsSummary(parentId: string) {
		const condition = parentId === 'NULL' ? ' is null' : `="${parentId}"`;
		const query = `select guid as account_guid, name, description, 
			if((select count(*) from accounts where parent_guid=account_guid) > 0, true, false) as has_subaccounts
			from accounts where parent_guid${condition}`;

		return this.queryData(query);
	}

	getAccountSummary(accountId: string, allAccounts = false) {
		let query = `select guid as id, parent_guid as parentId, name, account_type, description, commodity_guid,
			(select sum(value_num/value_denom) from splits where account_guid=id) as total
			from accounts`;

		if (!allAccounts) {
			query += ` where guid="${accountId}"`
		}

		return this.queryData<any[]>(query);
	}

	getCommodities(){
		let query = `select * from commodities`;
		return this.queryData<any[]>(query);
	}

	getTransactions(accountId: string){
		let query =`select guid, reconcile_state, reconcile_date, (value_num/value_denom) as amount, tx_guid,
			(select post_date from transactions where guid=tx_guid) as post_date,
			(select description from transactions where guid=tx_guid) as description
			from splits where account_guid="${accountId}" order by post_date;`

		return this.queryData<any[]>(query);
	}

	private queryData<TData>(query: string): Observable<TData> {
		return Observable.create((observer: Observer<TData>) => {
			this.connection.connect();

			this.connection.query(query, (err, results, fields) => {
				if (err) {
					observer.error(err);
					return;
				}
				observer.next(results);
				observer.complete();
			})

			this.connection.end();
		});
	}
}
