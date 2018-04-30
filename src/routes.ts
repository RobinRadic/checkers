import { Route } from '#/router';
import { Loading } from '@/Loading';
import Loadable from 'react-loadable'
import 'router5-helpers'
import UserNode from './views/nodes/UserNode';
import GameNode from './views/nodes/GameNode';
import { container, Symbols } from '#/ioc';
import { AuthStore } from '#/stores';
import { resolve } from './utils/promise';
import CreateRoomView from './views/game/CreateRoomView';

const log = require('debug')('routes')

const componentLoader = (dynamicImport: () => Promise<any>) => Loadable({
    loader : dynamicImport,
    loading: Loading
})

export const routes: Route[] = [
    { name: 'home', path: '/', component: componentLoader(() => import(/* webpackChunkName: "views.home" */'views/HomeView')) },
    {
        name: 'user', path: '/user', forwardTo: 'user.login', component: UserNode, children: [
            { name: 'login', path: '/login', component: componentLoader(() => import(/* webpackChunkName: "views.user.login" */'views/LoginView')) },
            { name: 'register', path: '/register', component: componentLoader(() => import(/* webpackChunkName: "views.user.register" */'views/RegisterView')) },
            { name: 'logout', path: '/logout', component: componentLoader(() => import(/* webpackChunkName: "views.user.logout" */'views/LogoutView')) },
            // { name: 'forgot', path: '/forgot-password', component: componentLoader(() => import(/* webpackChunkName: "views.user.forgot" */'views/RegisterView')) },
            // {
            //     name: 'logout', path: '/logout',component:null, forward: (state) => {
            //         debugger
            //         return container.get<AuthStore>(Symbols.AuthStore).logout().then(res => {
            //             return resolve({ name: 'home' })
            //         })
            //     }
            // }
        ]
    },
    {
        name: 'game', path: '/game', forwardTo: 'game.join', component: GameNode, children: [
            { name: 'join', path: '/join', component: componentLoader(() => import(/* webpackChunkName: "views.game.join" */'views/GameView')) },
            { name: 'create', path: '/create', component: componentLoader(() => import(/* webpackChunkName: "views.game.create" */'views/game/CreateRoomView')) },
            { name: 'room', path: '/room', component: componentLoader(() => import(/* webpackChunkName: "views.game.room" */'views/GameView')) },
            { name: 'board', path: '/board', component: componentLoader(() => import(/* webpackChunkName: "views.game.board" */'views/GameView')) }
        ]
    }

]
