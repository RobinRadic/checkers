import { ContainerModule } from 'inversify';
import { AuthStore, BreakpointStore, GameStore, RootStore, RouterStore } from '#/stores';
import { container, Symbols } from './';
import { routes } from 'routes';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Api, AuthApi } from '#/api';
import config, { IConfig } from 'config'

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
        bind(Symbols.GameStore).to(GameStore).inSingletonScope()
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

    bind(Symbols.Pusher).toDynamicValue((ctx) => {
        return new Pusher('52825a2e52a77953c55a', {
            encrypted: true,
            cluster  : 'eu'
        })
    });
    bind(Symbols.Echo).toDynamicValue((ctx) => {
        const echo = new Echo({
            broadcaster: 'pusher',
            key        : '52825a2e52a77953c55a',
            cluster    : 'eu',
            encrypted  : true,
            namespace  : 'App.Events'
        })
        return echo;
    })
}))
