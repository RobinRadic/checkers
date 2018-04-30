import { Container as BaseContainer, decorate, injectable as _injectable, interfaces } from 'inversify';


const log = require('debug')('ioc:container')

export type ServiceIdentifier = interfaces.ServiceIdentifier<any>;

export class Container extends BaseContainer {


    /**
     * Create an instance of a class using the container, making it injectable at runtime and able to @inject on the fly
     * @param cls
     * @param factoryMethod
     * @returns {T}
     */
    public build<T>(cls: any, factoryMethod?: (context: interfaces.Context) => any): T {

        if ( factoryMethod ) {
            this.ensureInjectable(cls);
            let k = 'temporary.kernel.binding';
            this.bind(k).toFactory<any>(factoryMethod);
            let instance = this.get<T>(k);
            this.unbind(k);
            return instance;

        }
        return this.resolve<T>(cls);
    }

    /**
     * make binds the class in the IoC container if not already bound. then returns the bound instance
     *
     * @param cls
     * @returns {T}
     */
    public make<T>(cls: any): T {
        return this.resolve<T>(cls);
    }

    public getParentClasses(cls: Function, classes: Function[] = []): Function[] {
        if ( cls[ '__proto__' ] !== null ) {
            classes.push(cls);
            return this.getParentClasses(cls[ '__proto__' ], classes)
        }
        return classes;
    }

    public ensureInjectable(cls: Function) {
        try { decorate(_injectable(), cls); } catch ( err ) {
            // console.log('ensureInjectable', err)
        }
    }

    public singleton(id: ServiceIdentifier, cls: any) {
        this.ensureInjectable(cls);
        this.bind(id).to(cls).inSingletonScope();
    }

    public constant<T>(id: ServiceIdentifier, val: T) {
        return this.bind(id).toConstantValue(val);
    }
}
