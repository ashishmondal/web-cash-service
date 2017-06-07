var path = require('path');
var gulp = require('gulp');
var server = require('gulp-develop-server');
var tsc = require('gulp-typescript');
var tslint = require("gulp-tslint");
var lintreporter = require('gulp-tslint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var tsconfig = require('./tsconfig.json');

var cwd = process.cwd();

tsconfig.compilerOptions.typescript = require('typescript');
//tsconfig.compilerOptions.rootDir = undefined;
//tsconfig.compilerOptions.outDir = undefined;
var tsProject = tsc.createProject(tsconfig.compilerOptions);

gulp.task('tsc', function (done) {
	var tscFiles = [path.join(cwd,'src/**/*.ts'), path.join(cwd, 'typings/main.d.ts')];
	var tsResult = gulp.src(tscFiles)
		.pipe(sourcemaps.init())
		.pipe(tsProject());
	var stream = tsResult.js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.join(cwd, 'dist')));
	stream.on('end', done);
	stream.on('error', done);
});

gulp.task('tslint', function (done) {
	var tslintFiles = [path.join(cwd,'src/**/*.ts')];
	var stream = gulp.src(tslintFiles)
		.pipe(tslint())
		//.pipe(tslint.report('verbose'));
		.pipe(tslint.report(lintreporter, {
			emitError: false,
			sort: true,
			bell: true
		}));
	stream.on('end', done);
	stream.on('error', done);
});

gulp.task('watch', ['tsc', 'tslint'], function (done) {
	var srcFiles = [path.join(cwd,'src/**/*.ts')];
	gulp.watch(srcFiles, ['tsc']);
	done();
});

// run server
gulp.task('server:start', ['tsc', 'tslint'], function (done) {
	process.chdir('dist');
	server.listen({
		path: 'server.js',
		env: {
			NODE_ENV: 'production'
		}
	});
	done();
});

gulp.task('server:start:debug', ['tsc'/*, 'tslint'*/], function (done) {
	process.chdir('dist');
	server.listen({
		path: 'server.js',
		env: {
			NODE_ENV: 'development'
		},
		execArgv : ['--debug-brk=41234', '--nolazy']
	});
	done();
});

gulp.task('server:restart', ['tsc', 'tslint'], function (done) {
	console.log('reiniciou');
	server.restart();
	done();
});

// restart server if app.js changed
gulp.task('serve', ['server:start'], function () {
	var srcFiles = [path.join(cwd,'src/**/*.ts')];
	gulp.watch(srcFiles, ['server:restart']);
});

gulp.task('serve:debug', ['server:start:debug'], function () {
	var srcFiles = [path.join(cwd,'src/**/*.ts')];
	gulp.watch(srcFiles, ['server:restart']);
});
