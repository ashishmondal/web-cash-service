"use strict";
const app_1 = require("../../inc/app");
const express = require("express");
const jwt = require("jsonwebtoken");
const FuncApp = require("../../inc/funcApp");
const data_service_1 = require("../../data/mysql/data-service");
var router = express.Router();
/**
 * @api {get} /v1.0/getAccessToken/:dsusr/:dspass Generate access_token
 * @apiName GetAccessToken
 * @apiDescription Returns a valid AcceessToken to Client based on username and password sent to it
 * @apiGroup Auth
 * @apiPermission Public
 * @apiVersion 1.0.0
 * @apiParam {String} dsusr      Mandatory, user login always an e-mail
 * @apiParam {String} dspass     Mandatory, user password as a MD5 encoded hash
 * @apiSuccess (200) {JSON} Object with client Access Token
 * @apiSuccessExample {JSON} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message_code": "OK",
 *       "access_token": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJaUzI1NiJ9.eyJpZFVzciI6MSwiaWRVc3JNYXN0ZXIccOjQyLCJpZEN1c3RvbWVyIjoxLCJkc1VzciI6IkZvdXJUd29hIGZzZGV2ZiBzZGZ2c2QgZnZzZWRmdiBzZGVmdmRzeGd2ZHN4ZyIsImRzTG9naW4iOiJmb3VydHdvQGZvdXJ0d28uY29tLmJyIiwiZHNQYXNzIjoiNWFiNzJkZmRhODJjZmNhNTMyOGQ0N2ZhMWNiODg5ZDQ1ZWQ0OTMyYTA5NTU1MjdmNzdmZWM1MzE5MDRiOWI2YiIsImRzRmJQYWdlIjoiRm91clR3b0FwIiwiZmxBY3RpdmUiOnRydWUsImR0TGFzdEluYWN0aXZlIjpudWxsLCJjZFZpZXdUeXBlIjoiSSIsImRzQ2xXaGl0ZUxhYmVsIjpudWxsLCJmbFdoaXRlTGFiZWwiOmZhbHNlLCJpZFVzckxvZyI6MSwiZHRMb2ciOiIyMDE1LTEyLTE1VDE1OjM4OjE2LjAwMFoiLCJ0b2tlbl9kYXRlIjoiMTQ1NjI0Nzk1MTUxMCIsImlhdCI6MTQ1NjI0Nzk1MX0.jxM_TWDN6iM-7yXaTwtr4FetYkHmJxUhJd143zKvZPFU"
 *     }
 * @apiErrorExample {JSON} Invalid Username or Password Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "code": 403.2,
 *       "message_code": "INVALID_USER_OR_PASSWORD",
 *       "message": "User or password trying to authenticate on this API is invalid!"
 *     }
 * @apiErrorExample {JSON} Inactive User Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "code": 401,
 *       "message_code": "INACTIVE_USER",
 *       "message": "Your user is not active on this API"
 *     }
 * @apiErrorExample {JSON} Bad Request Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "code": 400,
 *       "message_code": "BAD_REQUEST",
 *       "message": "Params sento to this end point does not look good!"
 *     }
 * @apiErrorExample {JSON} Unexpected Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "code": 500,
 *       "message_code": "ERROR",
 *       "message": "",
 *       "error": ERROR_DESCRIPTION
 *     }
 */
router.get('/getAccessToken/:dsusr/:dspass', (req, res) => {
    const { dsusr, dspass } = req.params;
    //let dspass = req.params.dspass;
    if ((!dsusr) || (!dspass) || (dsusr === '') || (dspass === '')) {
        FuncApp.sendNoDataJSON(400, 400, 'BAD_REQUEST', 'Params sento to this end point does not look good!', res);
        return;
    }
    // Checking if the user and password is OK
    // if (invalidUser) {
    // 	FuncApp.invaliUser(res);
    // 	return;
    // }
    // if (invalidPass) {
    // 	FuncApp.invaliUser(res);
    // 	return;
    // }
    // if (inactiveUser) {
    // 	FuncApp.inactiveUser(res);
    // 	return;
    // }
    let userObj = { 'id': 'userID', 'name': 'userName' };
    // userObj.token_date = (new Date()).getTime().toString();
    // userObj.dsPass = funcgen.stringEncrypt(password, userObj.token_date + 'ÿ' + app.locals.config.encryptPass);
    let authToken = jwt.sign(userObj, app_1.app.locals.config.tokenSecret);
    res.status(200);
    res.json({
        'code': 200,
        'message_code': 'OK',
        'access_token': 'Bearer ' + authToken
    });
});
/**
 * @api {get} /v1.0/me Get current logged User data
 * @apiName GetCurrentUser
 * @apiDescription Returns the current user logged data
 * @apiGroup User
 * @apiPermission Authenticated Users
 * @apiVersion 1.0.0
 * @apiHeader {String} Authorization Authorization header with Bearer AccessToken
 * @apiSuccess (200) {JSON} Object with current user logged data
 * @apiSuccessExample {JSON} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message_code": "OK",
 *       "message": "",
 *       "data": [
 *       		{'userData': 'Blabla'}
 *       ]
 *     }
 * @apiErrorExample {JSON} Unexpected Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "code": 500,
 *       "message_code": "ERROR",
 *       "message": "",
 *       "error": ERROR_DESCRIPTION
 *     }
 */
router.get('/me', (req, res) => {
    FuncApp.sendDataJSON(200, 200, 'OK', '', [{ 'userData': 'Blabla' }], res);
});
router.get('/accounts', (req, res) => {
    const dataService = new data_service_1.DataService(app_1.app.locals.config);
    dataService.getAccount()
        .subscribe(account => {
        FuncApp.sendDataJSON(200, 200, 'OK', '', [account], res);
    }, error => FuncApp.sendErrorJSON(502, 502, 'ERROR', '', [error], res));
});
router.get('/accounts/info/:id', (req, res) => {
    const dataService = new data_service_1.DataService(app_1.app.locals.config);
    dataService.getSubAccounts(req.params.id)
        .subscribe(accounts => {
        FuncApp.sendDataJSON(200, 200, 'OK', '', accounts, res);
    }, error => FuncApp.sendErrorJSON(502, 502, 'ERROR', '', [error], res));
});
router.get('/accounts/summary', (req, res) => {
    const dataService = new data_service_1.DataService(app_1.app.locals.config);
    dataService.getAccountSummary(null, true)
        .subscribe(accounts => {
        FuncApp.sendDataJSON(200, 200, 'OK', '', [accounts], res);
    }, error => FuncApp.sendErrorJSON(502, 502, 'ERROR', '', [error], res));
});
router.get('/accounts/summary/:id', (req, res) => {
    const dataService = new data_service_1.DataService(app_1.app.locals.config);
    dataService.getAccountSummary(req.params.id)
        .subscribe(accounts => {
        FuncApp.sendDataJSON(200, 200, 'OK', '', [accounts], res);
    }, error => FuncApp.sendErrorJSON(502, 502, 'ERROR', '', [error], res));
});
router.get('/commodities', (req, res) => {
    const dataService = new data_service_1.DataService(app_1.app.locals.config);
    dataService.getCommodities()
        .subscribe(commodities => {
        FuncApp.sendDataJSON(200, 200, 'OK', '', [commodities], res);
    }, error => FuncApp.sendErrorJSON(502, 502, 'ERROR', '', [error], res));
});
router.get('/transactions/:accountId', (req, res) => {
    const dataService = new data_service_1.DataService(app_1.app.locals.config);
    dataService.getTransactions(req.params.accountId)
        .subscribe(commodities => {
        FuncApp.sendDataJSON(200, 200, 'OK', '', [commodities], res);
    }, error => FuncApp.sendErrorJSON(502, 502, 'ERROR', '', [error], res));
});
module.exports = router;
