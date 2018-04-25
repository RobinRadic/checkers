import { IReactComponent, IWrappedComponent } from 'mobx-react';

export interface RouteLifecycle {
    onEnter?: (route: Route, params: any, store: RouterStore, queryParams: any) => void
    onExit?: (route: Route, params: any, store: RouterStore, queryParams: any) => void
    beforeEnter?: (route: Route, params: any, store: RouterStore, queryParams: any) => void
    beforeExit?: (route: Route, params: any, store: RouterStore, queryParams: any) => void
    onParamsChange?: (route: Route, params: any, store: RouterStore, queryParams: any) => void
}

export interface RouteProps {
    component: IReactComponent<any> | JSX.Element
    path: string
    originalPath?: string
    rootPath?: string
}

export class RouterStore {
    params: any
    queryParams: any
    currentView: Route

    goTo(view, paramsObj, store, queryParamsObj)
}
export type RoutesType = { [key: string]: Route }
export function startRouter(view: RoutesType, store: RouterStore)

export interface MobxRouterProps {store: RouterStore}

export const MobxRouter: IWrappedComponent<MobxRouterProps> & IReactComponent<any>


export class Route implements RouteProps, RouteLifecycle {
    constructor(props: RouteProps & RouteLifecycle)

    goTo(store, paramsArr)

    getParamsObject(paramsArray)

    replaceUrlParams(params, queryParams = {})

    getRootPath()

}