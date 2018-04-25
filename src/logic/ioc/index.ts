import { Container, ServiceIdentifier } from './Container'
import { decorate, injectable, interfaces, postConstruct } from 'inversify';
import { makeFluentProvideDecorator, makeProvideDecorator } from 'inversify-binding-decorators';
import getDecorators from 'inversify-inject-decorators';
import bindInterfaces from 'inversify-binding-decorators/dts/interfaces/interfaces'

const log = require('debug')('ioc')


export type ServiceIdentifier = interfaces.ServiceIdentifier<any>;


export * from './Container'
export * from './Symbols'
export * from './module'

export const container: Container = new Container();
export const inject               = getDecorators(container, false).lazyInject;
export const provide              = makeProvideDecorator(container);
export const provides             = makeFluentProvideDecorator(container);
export const singleton            = (identifier: ServiceIdentifier, provideIn?: (binding: bindInterfaces.ProvideWhenOnSyntax<any>) => void) => {
    let binding = provides(identifier).inSingletonScope();
    if ( provideIn !== undefined ) {
        provideIn(binding);
    }
    return binding.done()
}
export const bindTo               = provide

export function ensureInjectable(): ClassDecorator {
    return (cls) => {
        let parent  = cls[ '__proto__' ];
        let parents = [];
        while ( parent ) {
            parents.push(parent);
            parent = parent[ '__proto__' ]
            if ( parent === undefined || parent.name === undefined || parent.name.length === 0 ) {
                parent = false
                break;
            }
        }
        if ( parents.length > 0 ) {
            log('ensureInjectable', { parents })
            parents.reverse().forEach(parent => {
                try {
                    decorate(injectable(), parent);
                } catch {

                }
            });
        }

        try {
            decorate(injectable(), cls);
        } catch {

        }
        return cls;
    }
}

export { postConstruct } from 'inversify'
export { autoProvide, makeFluentProvideDecorator, makeProvideDecorator } from 'inversify-binding-decorators'
export * from 'inversify-inject-decorators'
