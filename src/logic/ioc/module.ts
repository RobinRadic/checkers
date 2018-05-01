import { ContainerModule } from 'inversify';
import { AuthStore, BreakpointStore, GameStore, RoomStore, RootStore, RouterStore, UserStore } from '#/stores';
import { container, Symbols } from './';
import { routes } from 'routes';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Api, AuthApi, RoomApi } from '#/api';
import config, { IConfig } from 'config'
import { PSEvents } from 'PSEvents';

// hot reload error (Ambiguous match found for serviceIdentifier) workaround _containerModule
const _containerModule       = Symbol('containerModule')
export const containerModule = new ContainerModule(((bind, unbind, isBound, rebind) => {
    if ( isBound(_containerModule) ) return;
    bind(_containerModule).toConstantValue(true);
    bind(Symbols.config).toConstantValue(config);
    bind(Symbols.routes).toConstantValue(routes)

    container.ensureInjectable(RouterStore);
    let stores = [
        bind(Symbols.RootStore).to(RootStore).inSingletonScope(),
        bind(Symbols.AuthStore).to(AuthStore).inSingletonScope(),
        bind(Symbols.BreakpointStore).to(BreakpointStore).inSingletonScope(),
        bind(Symbols.RouterStore).to(RouterStore).inSingletonScope(),
        bind(Symbols.GameStore).to(GameStore).inSingletonScope(),
        bind(Symbols.UserStore).to(UserStore).inSingletonScope(),
        bind(Symbols.RoomStore).to(RoomStore).inSingletonScope()
    ];

    if ( DEV ) {
        stores.forEach(binding => binding.onActivation((ctx, store) => {
            require('mobx-devtools-mst').default(store);
            return store;
        }))
    }

    bind(Symbols.Api).to(Api).inSingletonScope().onActivation((ctx, api: Api) => {
        const config = ctx.container.get<IConfig>(Symbols.config);
        api.configure(config.api)
        return api;
    })
    bind(Symbols.AuthApi).to(AuthApi).inSingletonScope()
    bind(Symbols.RoomApi).to(RoomApi).inSingletonScope()

    bind(Symbols.PSEvents).toDynamicValue(ctx => new PSEvents()).inSingletonScope();

    bind(Symbols.Pusher).toDynamicValue((ctx) => {
        const config                      = ctx.container.get<IConfig>(Symbols.config);
        const { key, cluster, encrypted } = config.pusher
        return new Pusher(key, {
            cluster,
            encrypted
        })
    });
    bind(Symbols.Echo).toDynamicValue((ctx) => {
        const config                      = ctx.container.get<IConfig>(Symbols.config);
        const { key, cluster, encrypted } = config.pusher
        const echo                        = new Echo({
            broadcaster: 'pusher',
            namespace  : 'App.Events',
            key,
            cluster,
            encrypted
        })
        return echo;
    })
}))
