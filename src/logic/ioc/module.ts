import { ContainerModule } from 'inversify';
import { BreakpointStore, RouterStore } from 'stores';
import { container, Symbols } from './';
import { routes } from '../../routes';

// hot reload error (Ambiguous match found for serviceIdentifier) workaround _containerModule
const _containerModule       = Symbol('containerModule')
export const containerModule = new ContainerModule(((bind, unbind, isBound, rebind) => {
    if ( isBound(_containerModule) ) return;
    bind(_containerModule).toConstantValue(true);
    container.bind(Symbols.routes).toConstantValue(routes)

    container.ensureInjectable(RouterStore);
    let stores = [
        bind(Symbols.BreakpointStore).to(BreakpointStore).inSingletonScope(),
        bind(Symbols.RouterStore).to(RouterStore).inSingletonScope()
    ];

    if ( DEV ) {
        stores.forEach(binding => binding.onActivation((ctx, store) => {
            require('mobx-devtools-mst').default(store);
            return store;
        }))
    }
}))
