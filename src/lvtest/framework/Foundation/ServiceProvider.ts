import { Application } from './Application';
import { interfaces } from 'inversify';

export interface IServiceProviderConstructor {
    new(app: Application): IServiceProvider
}

export interface IServiceProvider {
    async?: boolean
    register?: (bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => void;
    boot?: Function
}

export abstract class ServiceProvider implements IServiceProvider {
    async: boolean = false

    constructor(protected app: Application) {}
}
