import { Dependencies as BaseDependencies, Params, Route as BaseRoute, State as BaseState } from 'router5/create-router';
import { RootStore, RouterStore } from '#/stores';

export type DoneFn = (err?: any, state?: State) => void

export interface State extends BaseState {
    apiData?: any
    component?: any
}

export interface Dependencies extends BaseDependencies {
    routerStore: RouterStore
    store: RootStore
}

export interface Route extends BaseRoute {
    component?: any
    children?: Route[]
    onActivate?: (data:{toState:State,fromState:State,store:RootStore}) => Promise<any>
    forward?: (state: State) => Promise<{ name: string, params?: any }> | {name:string,params?:any}
    auth?: {
        only?:boolean
        except?:boolean

    }
}
