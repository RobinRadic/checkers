import browserPlugin, { BrowserPluginOptions } from 'router5/plugins/browser';
import { Options } from 'router5/create-router';
import createRouter from 'router5';
import { Route } from './types';
import { RouterStore } from '#/stores';
import {mobxPlugin} from './mobxPlugin';
import { onActivateMiddlewareFactory, forwardMiddleware } from './middleware';
import { isFunction } from 'lodash';


export interface MakeRouterOptions extends Partial<Options> {
    browserPluginOptions?: BrowserPluginOptions
    dependencies?: () => Array<{name:string, dependency:any}>
}

export function makeRouter(routes: Route[], routerStore: RouterStore, routerOptions: MakeRouterOptions = {}) {
    let { browserPluginOptions, ...options } = routerOptions

    options      = {
        defaultRoute     : 'home',
        strictQueryParams: true,
        ...options
    };
    const router = createRouter(routes, options)

    browserPluginOptions = {
        useHash: false,
        ...browserPluginOptions
    }

    if(isFunction(routerOptions.dependencies)) {
        routerOptions.dependencies().forEach(dep => router.setDependency(dep.name, dep.dependency));
    }
    router
        .usePlugin(browserPlugin(browserPluginOptions))
        .usePlugin(mobxPlugin(routerStore))
        .useMiddleware(forwardMiddleware(routes))
        .useMiddleware(onActivateMiddlewareFactory(routes))

    // .usePlugin(loggerPlugin)

    return router;


}
