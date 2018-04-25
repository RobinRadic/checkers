import { ApiRequestConfig } from 'interfaces';
import { ContainerModule } from 'inversify';
import { Api, Cache, Client, MemoryStrategy } from 'api';
import { BreakpointStore, DocumentStore, LayoutStore, LayoutStoreFooter, LayoutStoreHeader, LayoutStorePage, LayoutStoreSide, RootStore, RouterStore } from 'stores';
import { Symbols } from './Symbols';
import { MenuManager } from 'utils/MenuManager';
import { container } from 'ioc';
import { routes } from '../../routes';

// hot reload error (Ambiguous match found for serviceIdentifier) workaround _containerModule
const _containerModule       = Symbol('containerModule')
export const containerModule = new ContainerModule(((bind, unbind, isBound, rebind) => {
    if ( isBound(_containerModule) ) return;
    bind(_containerModule).toConstantValue(true);

    bind(Symbols.Cache).to(Cache).inTransientScope();
    bind(Symbols.ApiClient).to(Client).inTransientScope();
    // bind(Symbols.ApiClientCacheStrategy).to(NoCacheStrategy)
    // bind(Symbols.ApiClientCacheStrategy).to(EtagStrategy)
    // bind(Symbols.ApiClientCacheStrategy).to(ExpiresStrategy)
    bind(Symbols.ApiClientCacheStrategy).to(MemoryStrategy).inTransientScope();
    bind(Symbols.ApiRequestConfig).toConstantValue({
        baseURL: '/api/v1'
    })
    bind(Symbols.Api).to(Api).inSingletonScope().onActivation((ctx, api: Api) => {
        api.client = ctx.container.get(Symbols.ApiClient)
        api.client.cache.setStrategy(ctx.container.get(Symbols.ApiClientCacheStrategy));
        api.configure(ctx.container.get<ApiRequestConfig>(Symbols.ApiRequestConfig))
        return api;
    })

    container.bind(Symbols.routes).toConstantValue(routes)

    container.ensureInjectable(RouterStore);
    let stores = [
        bind(Symbols.LayoutStore).to(LayoutStore).inSingletonScope(),
        bind(Symbols.RootStore).to(RootStore).inSingletonScope(),
        bind(Symbols.BreakpointStore).to(BreakpointStore).inSingletonScope(),
        bind(Symbols.DocumentStore).to(DocumentStore).inSingletonScope(),

        bind(Symbols.RouterStore).to(RouterStore).inSingletonScope(),

        bind(Symbols.LayoutStoreHeader).to(LayoutStoreHeader).inSingletonScope(),
        bind(Symbols.LayoutStorePage).to(LayoutStorePage).inSingletonScope(),
        bind(Symbols.LayoutStoreFooter).to(LayoutStoreFooter).inSingletonScope()
    ];

    bind(Symbols.LayoutStoreLeft)
        .to(LayoutStoreSide)
        .inSingletonScope()
        .onActivation((ctx, store: LayoutStoreSide) => {
            store.setDefaults();
            store.setClass('c-left', true)
            if ( DEV ) {
                require('mobx-devtools-mst').default(store);
            }
            return store;
        });
    bind(Symbols.LayoutStoreRight)
        .to(LayoutStoreSide)
        .inSingletonScope()
        .onActivation((ctx, store: LayoutStoreSide) => {
            store.setDefaults();
            store.setClass('c-right', true)
            if ( DEV ) {
                require('mobx-devtools-mst').default(store);
            }
            return store;
        });

    if ( DEV ) {
        stores.forEach(binding => binding.onActivation((ctx, store) => {
            require('mobx-devtools-mst').default(store);
            return store;
        }))
    }


    bind(Symbols.MenuManager).to(MenuManager).inSingletonScope();
    //
    // bind(Symbols.InspectorDevStore).to(InspectorDevStore).inSingletonScope();
    //
    // bind<RouteProps[]>(Symbols.routes).toConstantValue([
    //     {
    //         path     : '/',
    //         exact    : true,
    //         component: Loadable({
    //             loader : () => import('pages/HomePage').then(({ HomePage }) => HomePage),
    //             loading: Loading
    //         })
    //     },
    //     {
    //         path     : '/documentation',
    //         component: Loadable({
    //             loader : () => import('pages/HomePage').then(({ HomePage }) => HomePage),
    //             loading: Loading
    //         })
    //     },
    //     {
    //         path     : '/documentation/:project/:revision/:document',
    //         component: Loadable({
    //             loader : () => import('pages/DocumentPage').then(({ DocumentPage }) => DocumentPage),
    //             loading: Loading
    //         })
    //     }
    // ])

}))
