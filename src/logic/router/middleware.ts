import { Dependencies, Route } from './types';
import { Middleware } from 'router5/core/middleware';
import { transitionPath } from 'router5';
import { Router } from 'router5/create-router';
import { DoneFn } from 'index.tsx';

const log = require('debug')('router:middleware')


export const apiCallMiddleware = (routes: Route[]) => (router: Router, dependencies: Dependencies): Middleware => (toState, fromState, done: DoneFn) => {
    const { toActivate } = transitionPath(toState, fromState);
    let calls            = routes
        .filter(r => toActivate.includes(r.name))
        .filter(route => {
            return Object.getOwnPropertyNames(route).includes('apiCall')
        })
    if ( calls.length === 0 ) return done();
    calls[ calls.length - 1 ].apiCall(toState.params, dependencies.store).then(apiData => done(null, { ...toState, apiData })).catch(err => done(err));
};
export const forwardMiddleware = (routes: Route[]) => (router: Router, dependencies: Dependencies): Middleware => (toState, fromState, done: DoneFn) => {
    const { toActivate } = transitionPath(toState, fromState);
    let forwards         = routes
        .filter(r => toActivate.includes(r.name))
        .filter(route => {
            return Object.getOwnPropertyNames(route).includes('forward')
        })
    if ( forwards.length === 0 ) return done();
    let forward = forwards[ 0 ].forward(toState);
    log('forwardMidlewar', { forward, toState })
    if ( toState.name !== forward.name ) {
        return done({ redirect: { name: forward.name, params: forward.params } })
    }
    done();
};
