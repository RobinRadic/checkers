import { Container, ContainerModule, interfaces } from 'inversify'
import { isFunction } from 'lodash'
import { Dispatcher } from '../Events/Dispatcher';
import { IServiceProvider, IServiceProviderConstructor } from './ServiceProvider';
import { EventsServiceProvider } from '../Events/EventsServiceProvider';
import { Listener } from 'eventemitter2';


export class Application extends Container {
    protected get events(): Dispatcher { return this.get<Dispatcher>(Dispatcher) };

    protected static _instance: Application;

    public static get instance(): Application {
        if ( Application._instance === undefined ) {
            Application._instance = new Application;
        }
        return Application._instance;
    }

    constructor() {
        super({ defaultScope: 'Transient' });

        if ( Application._instance !== undefined ) {
            throw new Error('Cannot create multiple instances of Application. Use Application.getInstance()')
        }

        this.registerBaseBindings();

        this.registerBaseServiceProviders();

    }

    protected serviceProviders: IServiceProvider[]     = []
    protected loadedProviders: Record<string, boolean> = {}
    protected isBooted: boolean                        = false;

    public register(Provider: IServiceProviderConstructor) {
        if ( this.loadedProviders[ Provider.name ] && this.loadedProviders[ Provider.name ] === true ) {
            return;
        }

        const provider = new Provider(this);
        if ( isFunction(provider.register) ) {
            const module = new ContainerModule((bind, unbind, isBound, rebind) => {
                provider.register(bind, unbind, isBound, rebind);
            });
            this.load(module);
        }
        this.serviceProviders.push(provider);
        this.loadedProviders[ Provider.name ] = true;

        if ( this.isBooted ) {
            this.bootProvider(provider);
        }
    }

    protected bootProvider(provider: IServiceProvider) {
        if ( isFunction(provider.boot) ) {
            provider.boot();
        }
    }

    public boot() {
        if ( this.isBooted === true ) {
            throw new Error('Application already booted');
        }
        this.events.emit('app.booting', this);
        this.serviceProviders.forEach(provider => {
            this.events.emit('app.booting.provider', provider);
            this.bootProvider(provider)
            this.events.emit('app.booted.provider', provider);
        })
        this.isBooted = true;
        this.events.emit('app.booted', this);
    }

    protected registerBaseBindings() {
        this.bind('app').toConstantValue(this);
        this.bind(Application).toConstantValue(this);
    }

    protected registerBaseServiceProviders() {
        this.register(EventsServiceProvider);
    }

    public singleton<T>(id: interfaces.ServiceIdentifier<T>, value: any): interfaces.BindingWhenOnSyntax<T> {
        return this.bind(id).to(value).inSingletonScope()
    }

    public booting(listener: Listener) {
        this.events.on('app.booting', listener);
    }

    public booted(listener: Listener) {
        this.events.on('app.booted', listener);
    }

}
