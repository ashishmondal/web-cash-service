import * as express from 'express';

// import * as funcgen from './funcgen';

export interface IAppRequest extends express.Request {
}

export interface IAppResponse extends express.Response {

}

/**
 * Send custom JSON to the client
 *
 * @param  {number} httpCode
 * @param  {number} code
 * @param  {string} messageCode
 * @param  {string} message
 * @param  {IAppResponse} res
 *
 */
export function sendNoDataJSON(httpCode: number, code: number, messageCode: string, message: string, res: IAppResponse): void {
	res.status(httpCode);
	res.json({
		'code': code,
		'message_code': messageCode,
		'message': message
	});
}

/**
 * Send default dataJSON to the client
 *
 * @param  {number} httpCode
 * @param  {number} code
 * @param  {string} messageCode
 * @param  {string} message
 * @param  {any[]} dataArray
 * @param  {IAppResponse} res
 *
 */
export function sendDataJSON(httpCode: number, code: number, messageCode: string,
                             message: string, dataArray: any[], res: IAppResponse): void {
	res.status(httpCode);
	res.json({
		'code': code,
		'message_code': messageCode,
		'message': message,
		'data': dataArray
	});
}

/**
 * Send default errorJSON to the client
 *
 * @param  {number} httpCode
 * @param  {number} code
 * @param  {string} messageCode
 * @param  {string} message
 * @param  {any} errorData
 * @param  {IAppResponse} res
 *
 */
export function sendErrorJSON(httpCode: number, code: number, messageCode: string,
                              message: string, errorData: any, res: IAppResponse): void {
	res.status(httpCode);
	res.json({
		'code': code,
		'message_code': messageCode,
		'message': message,
		'error': errorData
	});
}


/**
 * Send unauthorized access JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
export function unauthorizedAccess(res: IAppResponse) : void {
	sendNoDataJSON(401, 401, 'UNAUTHORIZED_ACCESS',
	                         'The client application making this request does not have access to this API or the User making this request does not have the enought privilege to complete his request', res);
}

/**
 * Send deny access JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
export function denyAccess(res: IAppResponse) : void {
	sendNoDataJSON(403, 403.2, 'ACCESS_DENIED', 'Authentication required', res);
}

/**
 * Send invalid user/pass JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
export function invaliUser(res: IAppResponse) : void {
	sendNoDataJSON(403, 403.2, 'INVALID_USER_OR_PASSWORD', 'User or password trying to authenticate on this API is invalid!', res);
}

/**
 * Send invalid host JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
export function invalidHost(res: IAppResponse) : void {
	sendNoDataJSON(403, 403.6, 'IP_ADDRESS_REJECTED', 'Access the API on this Host/IP is not allowed', res);
}

/**
 * Send invalid token JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
export function invalidToken(res: IAppResponse) : void {
	sendNoDataJSON(401, 401, 'INVALID_TOKEN', 'Invalid or expired token', res);
}

/**
 * Send inactive user JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
export function inactiveUser(res: IAppResponse) : void {
	sendNoDataJSON(401, 401, 'INACTIVE_USER', 'Your user is not active on this API', res);
}

/**
 * Send unauthorized access JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
export function tooLargeSize(res: IAppResponse) : void {
	sendNoDataJSON(413, 413, 'TOO_LARGE_SIZE',
	                         'The server is refusing to process a request because the request entity is larger than the server is willing or able to process.', res);
}

/**
 * Send permission required JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
export function permissionRequired(res: IAppResponse) : void {
	sendNoDataJSON(401, 401, 'PERMISSION_REQUIRED',
	                         'The User making this request does not have the enought privilege to complete his request', res);
}
