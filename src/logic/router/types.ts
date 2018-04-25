import { Dependencies as BaseDependencies, Params, Route as BaseRoute, State as BaseState } from 'router5/create-router';
import { Api } from 'api';
import { RouterStore, RootStore } from 'stores';

export type DoneFn = (err?: any, state?: State) => void

export interface State extends BaseState {
    apiData?: any
    component?: any
}

export interface Dependencies extends BaseDependencies {
    store:RootStore
    routerStore: RouterStore
    api: Api
}

export interface Route extends BaseRoute {
    component?: any
    children?: Route[]
    apiCall?: <P, T>(params: Params & P, store: RootStore) => Promise<T>
    forward?: (state: State) => { name: string, params?: any }
}