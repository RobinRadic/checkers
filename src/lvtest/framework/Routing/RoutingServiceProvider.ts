import { ServiceProvider } from '../Foundation/ServiceProvider';
import { Router } from './Router';

export class RoutingServiceProvider extends ServiceProvider {
    register(bind, unbind, isBound, rebind) {
        this.app.singleton(Router, Router);
    }
}
