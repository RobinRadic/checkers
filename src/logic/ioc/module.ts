import { ContainerModule } from 'inversify';
import { BreakpointStore, GameStore, RouterStore } from '#/stores';
import { container, Symbols } from './';
import { routes } from 'routes';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


// hot reload error (Ambiguous match found for serviceIdentifier) workaround _containerModule
const _containerModule       = Symbol('containerModule')
export const containerModule = new ContainerModule(((bind, unbind, isBound, rebind) => {
    if ( isBound(_containerModule) ) return;
    bind(_containerModule).toConstantValue(true);
    bind(Symbols.routes).toConstantValue(routes)

    container.ensureInjectable(RouterStore);
    let stores = [
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
