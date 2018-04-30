import { Application } from '../Application';
import { Repository } from '../../Config/Repository';
import { IServiceProviderConstructor } from '../ServiceProvider';

export class RegisterProviders {
    bootstrap(app: Application) {
        const config    = app.get<Repository>('config');
        const providers = config.get<IServiceProviderConstructor[]>('app.providers');
        providers.forEach(Provider => app.register(Provider));
    }
}
