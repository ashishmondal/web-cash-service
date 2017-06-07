export interface IData {
	id: string;
}

export interface IAccount extends IData{
	name:string;
	type: string;
	subAccounts: IAccount[];
}

export interface IAccountInfo extends IData{
	name: string;
	description: string;
	hasSubAccounts: boolean;
}
