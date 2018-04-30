import { LoadConfiguration } from '../Foundation/Bootstrappers/LoadConfiguration';
import { RegisterProviders } from '../Foundation/Bootstrappers/RegisterProviders';
import { BootProviders } from '../Foundation/Bootstrappers/BootProviders';
import { Application } from '../Foundation/Application';


export class Kernel {
    bootstrappers = [
        LoadConfiguration,
        RegisterProviders,
        BootProviders
    ]

    constructor(protected app: Application) {}

    handle(args: any[]=[]) {
        this.bootstrap();
    }

    protected bootstrap() {
        this.bootstrappers.forEach(Bootstrapper => {
            (new Bootstrapper()).bootstrap(this.app);
        })
    }
}
