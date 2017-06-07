import { Config } from './inc/config';
import { app } from './inc/app';

app.locals.environment = 'dev';
app.locals.config = Config.getConfig();

import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as expressJWT from 'express-jwt';

import * as FuncApp from './inc/funcApp';
import * as funcgen from './inc/funcgen';

// If we are at development environment, interprets sourcemaps...
if (app.locals.environment === 'dev') {
	require('source-map-support').install();
}

/**
 * Disable the HTTP Header X-Powered-By for safety reasons!
 */
app.disable('x-powered-by');

/**
 * Enable All CORS Requests
 * Package documentation can be found here: https://github.com/expressjs/cors
 */
app.use(cors());

/**
 * The bodyParser object exposes various factories to create middlewares. All middlewares will populate the req.body
 * property with the parsed body or provide an error to the callback.
 *
 * Full module description: https://github.com/expressjs/body-parser/blob/master/README.md
 */
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));


let publicEndPoints = [/getAccessToken/g];
app.use(['/v*'],
	expressJWT({ secret: app.locals.config.tokenSecret }).unless({ path: publicEndPoints })
);


/**
 * Verifying Host vs Environment.
 *
 * Check the current host is allowed at API
 *
 */
app.use((req, res, next) => {
	if (Config.isValidHost(req.hostname)) {
		FuncApp.invalidHost(res);
	} else {
		next();
	}
});

/**
 * Verifying user Authentication.
 */
app.use((req: FuncApp.IAppRequest, res, next) => {
	// Apply here user validation
	// All user's fields sent on token's payload will be avaible at re.user
	next();
});

/**
 * Create API versions route.
 *
 * Read directory /api/ and create route to all API versions
 *
 */
fs.readdirSync('./api').forEach((dir) => {
	let vRoute = require('./api/' + dir + '/router');
	app.use('/' + dir, vRoute);
});

/**
 * @apiIgnore
 * @api {get} /apiVersions
 * @apiDescription Returns a list of API avaiable versions
 * @apiGroup API Information
 * @apiPermission Public
 * @apiSuccess (200) {JSON} List of avaiable API versions
 * @apiSuccessExample {JSON} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message_code": "OK",
 *       "message": "",
 *       "data": [
 *         "v1.0"
 *       ]
 *     }
 */
app.get('/apiVersions', (req: FuncApp.IAppRequest, res) => {
	let apiArr = [];
	fs.readdirSync('./api').forEach((dir) => {
		apiArr.push(dir);
	});
	FuncApp.sendDataJSON(200, 200, 'OK', '', apiArr, res);
});

/**
 * @apiIgnore
 * @api {get} /lastApiVersion
 * @apiDescription Returns the last version of API
 * @apiGroup API Information
 * @apiPermission Public
 * @apiSuccess (200) {JSON} Single item list with last version of API
 * @apiSuccessExample {JSON} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message_code": "OK",
 *       "message": "",
 *       "data": [
 *         "v1.0"
 *       ]
 *     }
 *
 */
app.get('/lastApiVersion/', (req: FuncApp.IAppRequest, res) => {
	let api = '';
	fs.readdirSync('./api').forEach((dir) => {
		api = dir;
	});
	let apiArr = [];
	apiArr.push(api);
	FuncApp.sendDataJSON(200, 200, 'OK', '', apiArr, res);
});

/**
 * Handling server error.
 *
 * Fired when tha called endpoint couldn't be found on API with 'message_code':'ENDPOINT_NOT_FOUND'
 *
 */
app.use((req: FuncApp.IAppRequest, res, next) => {
	FuncApp.sendNoDataJSON(404, 404, 'ENDPOINT_NOT_FOUND',
	               'The API end point you are trying to reach does not exist or has been moved. Please ckeck the documentation to find what you are looking for.', res);
});

/**
 * Handling server error 500.
 *
 * Fired when any endpoint trows an exception with 'message_code': 'INTERNAL_SERVER_ERROR'
 *
 */
app.use((err: any, req: FuncApp.IAppRequest, res, next) => {
	if (err.code === 'credentials_required') {
		FuncApp.unauthorizedAccess(res);
		return;
	}
	if (err.code === 'invalid_token') {
		FuncApp.invalidToken(res);
		return;
	}
	if(funcgen.isset(() => err.inner.name) && (err.inner.name === 'JsonWebTokenError')) {
		FuncApp.unauthorizedAccess(res);
		return;
	}
	FuncApp.sendErrorJSON(500, 500, 'ERROR', '', funcgen.getErrorTratament(err), res);
});

/**
 * Stating server
 */
let server = app.listen(process.env.PORT || 3000, () => {
	//let host = server.address().address;
	let port = server.address().port;
	if (app.locals.config.debug) {
		console.log('Service started at port: ' + port);
	}
});
