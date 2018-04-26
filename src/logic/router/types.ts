import { Dependencies as BaseDependencies, Params, Route as BaseRoute, State as BaseState } from 'router5/create-router';
import { RouterStore  } from '#/stores';

export type DoneFn = (err?: any, state?: State) => void

export interface State extends BaseState {
    apiData?: any
    component?: any
}

export interface Dependencies extends BaseDependencies {
    routerStore: RouterStore
}

export interface Route extends BaseRoute {
    component?: any
    children?: Route[]
    forward?: (state: State) => { name: string, params?: any }
}
