import browserPlugin, { BrowserPluginOptions } from 'router5/plugins/browser';
import { container, Symbols } from 'ioc';
import { Options } from 'router5/create-router';
import createRouter from 'router5';
import { Route } from './types';
import { apiCallMiddleware, forwardMiddleware } from './middleware';
import { RouterStore } from 'stores';
import mobxPlugin from './mobxPlugin';


export interface MakeRouterOptions extends Partial<Options> {
    browserPluginOptions?: BrowserPluginOptions
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

    router
        .setDependency('store', container.get(Symbols.RootStore))
        .setDependency('api', container.get(Symbols.Api))
        .usePlugin(browserPlugin(browserPluginOptions))
        .usePlugin(mobxPlugin(routerStore))
        // .usePlugin(loggerPlugin)
        .useMiddleware(apiCallMiddleware(routes))
        .useMiddleware(forwardMiddleware(routes))

    return router;


}