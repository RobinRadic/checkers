import { Route } from 'router';
import { Loading } from '@/Loading';
import Loadable from 'react-loadable'

const log = require('debug')('routes')

const componentLoader = (dynamicImport: () => Promise<any>) => Loadable({
    loader : dynamicImport,
    loading: Loading
})

export const routes: Route[] = [
    { name: 'home', path: '/', component: componentLoader(() => import(/* webpackChunkName: "views.home" */'views/HomeView')) },
    { name: 'game', path: '/game', component: componentLoader(() => import(/* webpackChunkName: "views.game" */'views/GameView')) }
]
