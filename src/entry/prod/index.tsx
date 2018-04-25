/**
 * Small entry script to use in <head> that asynchronously loads the application
 */
import { IBooter } from './start';

if(ASYNC_START) {
    let promise: Promise<IBooter>;

    const load = () => {
        if ( promise === undefined ) {
            promise = import(/* webpackChunkName: "start" */'./start') as any
        }
        return promise;
    }

    window[ 'CodexLoader' ] = load;

    load();
}

if(!ASYNC_START) {
    const booter = require('./start')
    const load = () => {
        return new Promise(res => {
            return res(booter)
        })
    }
    window[ 'CodexLoader' ] = load;
}