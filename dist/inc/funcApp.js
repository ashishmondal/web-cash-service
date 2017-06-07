"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function sendNoDataJSON(httpCode, code, messageCode, message, res) {
    res.status(httpCode);
    res.json({
        'code': code,
        'message_code': messageCode,
        'message': message
    });
}
exports.sendNoDataJSON = sendNoDataJSON;
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
function sendDataJSON(httpCode, code, messageCode, message, dataArray, res) {
    res.status(httpCode);
    res.json({
        'code': code,
        'message_code': messageCode,
        'message': message,
        'data': dataArray
    });
}
exports.sendDataJSON = sendDataJSON;
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
function sendErrorJSON(httpCode, code, messageCode, message, errorData, res) {
    res.status(httpCode);
    res.json({
        'code': code,
        'message_code': messageCode,
        'message': message,
        'error': errorData
    });
}
exports.sendErrorJSON = sendErrorJSON;
/**
 * Send unauthorized access JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
function unauthorizedAccess(res) {
    sendNoDataJSON(401, 401, 'UNAUTHORIZED_ACCESS', 'The client application making this request does not have access to this API or the User making this request does not have the enought privilege to complete his request', res);
}
exports.unauthorizedAccess = unauthorizedAccess;
/**
 * Send deny access JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
function denyAccess(res) {
    sendNoDataJSON(403, 403.2, 'ACCESS_DENIED', 'Authentication required', res);
}
exports.denyAccess = denyAccess;
/**
 * Send invalid user/pass JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
function invaliUser(res) {
    sendNoDataJSON(403, 403.2, 'INVALID_USER_OR_PASSWORD', 'User or password trying to authenticate on this API is invalid!', res);
}
exports.invaliUser = invaliUser;
/**
 * Send invalid host JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
function invalidHost(res) {
    sendNoDataJSON(403, 403.6, 'IP_ADDRESS_REJECTED', 'Access the API on this Host/IP is not allowed', res);
}
exports.invalidHost = invalidHost;
/**
 * Send invalid token JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
function invalidToken(res) {
    sendNoDataJSON(401, 401, 'INVALID_TOKEN', 'Invalid or expired token', res);
}
exports.invalidToken = invalidToken;
/**
 * Send inactive user JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
function inactiveUser(res) {
    sendNoDataJSON(401, 401, 'INACTIVE_USER', 'Your user is not active on this API', res);
}
exports.inactiveUser = inactiveUser;
/**
 * Send unauthorized access JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
function tooLargeSize(res) {
    sendNoDataJSON(413, 413, 'TOO_LARGE_SIZE', 'The server is refusing to process a request because the request entity is larger than the server is willing or able to process.', res);
}
exports.tooLargeSize = tooLargeSize;
/**
 * Send permission required JSON to the client
 *
 * @param  {IAppResponse} res
 *
 */
function permissionRequired(res) {
    sendNoDataJSON(401, 401, 'PERMISSION_REQUIRED', 'The User making this request does not have the enought privilege to complete his request', res);
}
exports.permissionRequired = permissionRequired;
