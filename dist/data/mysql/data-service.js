"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const Observable_1 = require("rxjs/Observable");
const data_models_1 = require("./data-models");
require("rxjs/add/operator/map");
class DataService {
    constructor(configuration) {
        this.connection = mysql_1.createConnection(configuration.db);
    }
    getAccount() {
        return this.queryData('SELECT * from accounts')
            .map(accountTables => data_models_1.Account.parse(accountTables).getJson());
    }
    getSubAccounts(parentId) {
        const condition = parentId === 'NULL' ? ' is null' : `="${parentId}"`;
        const query = 'select * from accounts where accounts.parent_guid' + condition;
        return this.queryData(query)
            .map(accountTables => accountTables.map(at => new data_models_1.AccountInfo(at)));
    }
    getSubAccountsSummary(parentId) {
        const condition = parentId === 'NULL' ? ' is null' : `="${parentId}"`;
        const query = `select guid as account_guid, name, description, 
			if((select count(*) from accounts where parent_guid=account_guid) > 0, true, false) as has_subaccounts
			from accounts where parent_guid${condition}`;
        return this.queryData(query);
    }
    getAccountSummary(accountId, allAccounts = false) {
        let query = `select guid as id, parent_guid as parentId, name, account_type, description, commodity_guid,
			(select sum(value_num/value_denom) from splits where account_guid=id) as total
			from accounts`;
        if (!allAccounts) {
            query += ` where guid="${accountId}"`;
        }
        return this.queryData(query);
    }
    getCommodities() {
        let query = `select * from commodities`;
        return this.queryData(query);
    }
    getTransactions(accountId) {
        let query = `select guid, reconcile_state, reconcile_date, (value_num/value_denom) as amount, tx_guid,
			(select post_date from transactions where guid=tx_guid) as post_date,
			(select description from transactions where guid=tx_guid) as description
			from splits where account_guid="${accountId}" order by post_date;`;
        return this.queryData(query);
    }
    queryData(query) {
        return Observable_1.Observable.create((observer) => {
            this.connection.connect();
            this.connection.query(query, (err, results, fields) => {
                if (err) {
                    observer.error(err);
                    return;
                }
                observer.next(results);
                observer.complete();
            });
            this.connection.end();
        });
    }
}
exports.DataService = DataService;
