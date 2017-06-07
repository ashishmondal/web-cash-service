import { IAccount, IAccountInfo } from "../data-models";

export class Account implements IAccount {
	id: string;
	name: string;
	type: string;
	subAccounts: Account[] = [];

	constructor(private accountTable: IAccountTable) {
		this.id = accountTable.guid;
		this.name = accountTable.name;
		this.type = accountTable.account_type;
	}

	getJson(): IAccount {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			subAccounts: this.subAccounts.map(sa => sa.getJson())
		};
	}

	public static parse(accounts: IAccountTable[]) {
		const allAccounts = accounts.map(at => new Account(at));
		allAccounts.forEach(a => a.subAccounts = allAccounts.filter(sa => sa.accountTable.parent_guid === a.accountTable.guid));
		return allAccounts.find(a => a.accountTable.parent_guid === null);
	}
}

export class IAccountTable {
	guid: string;
	name: string;
	account_type: string;
	commodity_guid: string;
	commodity_scu: number;
	non_std_scu: number;
	parent_guid: string;
	code: string;
	description: string;
	hidden: number;
	placeholder: number;
};

export class AccountInfo implements IAccountInfo {
	name: string;
	description: string;
	hasSubAccounts: boolean;
	id: string;

	constructor(table: IAccountTable){
		this.name = table.name;
		this.description = table.description;
		this.hasSubAccounts = true;
		this.id = table.guid;
	}
}