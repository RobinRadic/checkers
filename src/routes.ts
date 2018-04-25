import { Route } from 'router';
import { Loading } from '@/Loading';
import Loadable from 'react-loadable'
import { Index } from 'api';
import { toJS } from 'mobx';

const log = require('debug')('routes')

const componentLoader = (dynamicImport: () => Promise<any>) => Loadable({
    loader : dynamicImport,
    loading: Loading
})

export const routes: Route[] = [
    { name: 'pyro', path: '/', component: componentLoader(() => import(/* webpackChunkName: "views.pyro" */'views/PyroView')) },
    { name: 'home', path: '/home', component: componentLoader(() => import(/* webpackChunkName: "views.home" */'views/HomeView')) },
    { name: 'dev', path: '/dev', component: componentLoader(() => import(/* webpackChunkName: "views.dev" */'views/DevView')) },
    {
        name     : 'documentation',
        path     : '/documentation',
        component: componentLoader(() => import(/* webpackChunkName: "views.document" */'views/DocumentView')),
        // component: redirectComponentFactory(() => {
        //     return new Promise((res, rej) => {
        //         let route = container.get<RouterStore>(Symbols.RouterStore).route
        //         log('documentation component', { route })
        //         let data           = route.apiData as Index
        //         let defaultProject = data.projects.default
        //         let project        = data.projects.items.find(p => p.key === defaultProject);
        //         let revision       = project.default_revision
        //         let document       = project.revisions[ revision ]
        //         res({ name: 'documentation.document', params: toJS({ project: project.key, revision, document }) })
        //     })
        // }),
        apiCall  : <Params, Index>(params, store) => store.fetch(),
        forward  : (state) => {
            let data           = state.apiData as Index
            let defaultProject = data.projects.default
            let project        = data.projects.items.find(p => p.key === defaultProject);
            let revision       = project.default_revision
            let document       = project.revisions[ revision ]
            let params         = toJS({ project: project.key, revision, document })
            log('forward', { state, params })
            return { name: 'documentation.document', params }
        },
        children : [
            {
                name     : 'document',
                path     : '/:project/:revision/*document',
                apiCall  : <Params, Document>(params, api) => {
                    return api.getDocument(params.project, params.revision, params.document + '?render');
                },
                component: componentLoader(() => import(/* webpackChunkName: "views.document" */'views/DocumentView'))
            }
        ]
    }
]
