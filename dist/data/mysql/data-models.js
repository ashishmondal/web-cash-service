"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Account {
    constructor(accountTable) {
        this.accountTable = accountTable;
        this.subAccounts = [];
        this.id = accountTable.guid;
        this.name = accountTable.name;
        this.type = accountTable.account_type;
    }
    getJson() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            subAccounts: this.subAccounts.map(sa => sa.getJson())
        };
    }
    static parse(accounts) {
        const allAccounts = accounts.map(at => new Account(at));
        allAccounts.forEach(a => a.subAccounts = allAccounts.filter(sa => sa.accountTable.parent_guid === a.accountTable.guid));
        return allAccounts.find(a => a.accountTable.parent_guid === null);
    }
}
exports.Account = Account;
class IAccountTable {
}
exports.IAccountTable = IAccountTable;
;
class AccountInfo {
    constructor(table) {
        this.name = table.name;
        this.description = table.description;
        this.hasSubAccounts = true;
        this.id = table.guid;
    }
}
exports.AccountInfo = AccountInfo;
