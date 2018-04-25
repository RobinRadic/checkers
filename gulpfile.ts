// noinspection ES6UnusedImports
import * as gulp from 'gulp'
import { GulpTasks } from '@radic/build-tools/gulp';
import { input } from '@radic/build-tools/input';
import { output } from '@radic/build-tools/output';
// import {output} from '@radic/build-tools/output';
import { Gulpclass, Task } from 'gulpclass';
import build from './build/task.build'
import serve from './build/task.serve'
import _env from './build/utils/env-utils'
import { ConfigEnv, DevServerCallbackOptions, EnvUtils } from './build/interfaces';
import * as browserSync from 'browser-sync';
import * as compression from 'compression';
import { getPort } from './build/utils';
import * as yargs from 'yargs';
import { spawn } from 'child_process'
import { Simulate } from 'react-dom/test-utils';
import * as globule from 'globule'
import { join, resolve } from 'path';
import { copyFileSync } from 'fs';

let argv = yargs.parse(process.argv.slice(2));

let dump = output.dump

@Gulpclass(gulp)
class AppTasks extends GulpTasks {
    protected options = [ 'async_start', 'profile', 'monitor' ];


    @Task('semantic:types') semanticTypes() {
        const basePath = resolve(__dirname, 'node_modules/semantic-ui-react/dist')
        const p        = (...s) => resolve(basePath, 'commonjs', ...s);
        let paths      = globule.find([ p('*.d.ts'), p('**/*.d.ts') ]);
        paths.forEach(srcPath => {
            let destPath = srcPath.replace(join(basePath, 'commonjs'), join(basePath, 'es'));
            copyFileSync(srcPath, destPath);
            output.line(`{bold}FROM:{/bold} ${srcPath.replace(basePath, '')} {bold}TO:{/bold} ${destPath.replace(basePath, '')}`)

        })
    }

    @Task('storybook')x
    async storybook() {
        let port = await getPort(this.config.port)
        let node = process.argv[ 0 ]
        spawn(node, [
            '--nolazy',
            '-r ts-node/register',
            resolve(__dirname, '.bin', 'start-storybook'),
            '-p 6006'
        ],{
            stdio: 'inherit',
            cwd: process.cwd(),
            detached: true
        }).unref();
        return this.resolve()
    }


    @Task('build:dev') buildDev() {
        let d = this.dev().defer();
        build((err, stat) => {
            if ( err ) return d.reject(err);
            d.resolve();
        })
        return d.promise;
    }

    @Task('build:dev:serve', [ 'build:dev' ])
    async buildDevServe() {
        let port = await getPort(this.config.port)
        browserSync.init({
            port  : port,
            server: {
                baseDir   : './dev',
                middleware: [ compression() ]
            }
        })
        return this.resolve()
    }

    @Task('serve:dev') serveDev() {
        let d = this.dev().defer();
        serve<DevServerCallbackOptions>((opts) => {
            if ( opts.err ) return d.reject(opts.err);
        })
        return d.promise;
    }

    @Task('build:prod') buildProd() {
        let d = this.prod().defer();
        build((err, stat) => {
            if ( err ) return d.reject(err);
            d.resolve();
        })
        return d.promise;
    }

    @Task('build:prod:serve', [ 'build:prod' ])
    async buildProdServe() {
        let port = await getPort(this.config.port)
        browserSync.init({
            port  : port,
            server: {
                baseDir   : './dist',
                middleware: [ compression() ]
            }
        })
        return this.resolve()
    }

    @Task('serve:prod') serveProd() {
        let d = this.prod().defer();
        serve<DevServerCallbackOptions>((opts) => {
            if ( opts.err ) return d.reject(opts.err);
        })
        return d.promise;
    }

    @Task('wizard')
    async wizard() {
        let env  = await input.list('What kind of env', [ 'dev', 'prod' ])
        let task = await input.list('What kind of task', [ 'build', 'serve' ])
        if ( task === 'build' ) {
            let server = await input.confirm('After building, start a browser-sync server there?', false)
        }
        let options = await input.checkbox('What options do you want to enable?', [ 'async_start', 'profile', 'monitor' ]);
        if ( env === 'dev' ) {
            this.dev()
        } else {
            this.prod();
        }
        // options.forEach(option => this.config[ option ] = true);
        let cmd = `${task}:${env} ` + options.map(o => '--' + o).join(' ');
        let go  = await input.confirm('Going to execute:: ' + cmd, true);
        if ( go ) {

            spawn(process.argv[ 0 ], [ process.argv[ 1 ], `${task}:${env}` ].concat(options.map(o => '--' + o)), {
                detached: true,
                stdio   : 'inherit',
                cwd     : process.cwd()
            }).unref()

        }
    }

    @Task('devtest') devTest() {
        output.dump({ argv: process.argv, argv0: process.argv0, exec: process.execArgv })
        output.dump(argv);
    }

    @Task('serve:prod:lv') serveProdLaravel() {
        throw new Error('Not yet implemented')
    }

    @Task('serve:pre') servePreProd() {
        throw new Error('Not yet implemented')
    }

    @Task('serve:api') serveApiMock() {
        throw new Error('not implemented')
    }


    protected dev(): this {
        process.env.NODE_ENV = 'development'
        return this.processArgv()
    }

    protected prod(): this {
        process.env.NODE_ENV = 'production'
        return this.processArgv()
    }

    protected processArgv(): this {
        this.options.forEach(option => {
            if ( argv && argv[ option ] !== undefined ) {
                this.env[ option ] = argv[ option ]
            }
        })
        return this;
    }

    protected resolve(arg?: any) { return Promise.resolve(arg)}

    protected reject(arg?: any) { return Promise.reject(arg)}

    protected get env(): EnvUtils { return _env() }

    protected get config(): ConfigEnv { return this.env.config }

}
