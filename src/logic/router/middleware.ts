import { Dependencies, Route } from './types';
import { Middleware, MiddlewareFactory } from 'router5/core/middleware';
import { DoneFn, transitionPath } from 'router5';
import { Router } from 'router5/create-router';


const log = require('debug')('router:middleware')


// export const apiCallMiddleware = (routes: Route[]) => (router: Router, dependencies: Dependencies): Middleware => (toState, fromState, done: DoneFn) => {
//     const { toActivate } = transitionPath(toState, fromState);
//     let calls            = routes
//         .filter(r => toActivate.includes(r.name))
//         .filter(route => {
//             return Object.getOwnPropertyNames(route).includes('apiCall')
//         })
//     if ( calls.length === 0 ) return done();
//     calls[ calls.length - 1 ].apiCall(toState.params, dependencies.store).then(apiData => done(null, { ...toState, apiData })).catch(err => done(err));
// };
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
    if ( typeof forward[ 'then' ] === 'function' ) {
        forward[ 'then' ]((data) => {
            if ( toState.name !== data.name ) {
                done({ redirect: { name: data.name, params: data.params } })
            }
        })
        return;
    }
    if ( toState.name !== forward[ 'name' ] ) {
        done({ redirect: { name: forward[ 'name' ], params: forward[ 'params' ] } })
    }
    done();
};


export const onActivateMiddlewareFactory = (routes: Route[]): MiddlewareFactory => (router: Router, dependencies: Dependencies): Middleware => (toState, fromState, done: DoneFn): any => {
    const { toActivate } = transitionPath(toState, fromState);

    const handlers = [];
    toActivate.forEach(segment => {
        const routeSegment = routes.find(r => r.name === segment);

        if (routeSegment && routeSegment.onActivate) {
            handlers.push(routeSegment.onActivate({toState,fromState,store:dependencies.store}))
        }
    });

    return Promise.all(handlers).then(() => done())
};

export const authMiddlewareFactory = (routes: Route[]): MiddlewareFactory => (router: Router, dependencies: Dependencies): Middleware => (toState, fromState, done: DoneFn): any => {
    const { toActivate } = transitionPath(toState, fromState);

    const handlers = [];
    toActivate.forEach(segment => {
        const routeSegment = routes.find(r => r.name === segment);

        if (routeSegment && routeSegment.onActivate) {
            handlers.push(routeSegment.onActivate({toState,fromState,store:dependencies.store}))
        }
    });

    return Promise.all(handlers).then(() => done())
};
