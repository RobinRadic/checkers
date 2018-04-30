import { ServiceProvider } from '../Foundation/ServiceProvider';
import { Dispatcher } from './Dispatcher';
import { ConstructorOptions } from 'eventemitter2';


export class EventsServiceProvider extends ServiceProvider {
    register(bind, unbind, isBound, rebind) {
        this.app.singleton(Dispatcher, Dispatcher);

        this.app
            .bind<ConstructorOptions>(Dispatcher.name + 'ConstructorOptions')
            .toConstantValue({
                wildcard         : true,
                delimiter        : '.',
                verboseMemoryLeak: true,
                maxListeners     : Infinity
            })
    }

    boot() {
        this.app.get(Dispatcher);
    }
}
