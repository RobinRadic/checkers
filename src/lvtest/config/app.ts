import { RoutingServiceProvider } from '../framework/Routing/RoutingServiceProvider';
import { ConsoleServiceProvider } from '../framework/Console/ConsoleServiceProvider';
import { HttpServiceProvider } from '../framework/Http/HttpServiceProvider';

export default {

    providers: [
        ConsoleServiceProvider,
        HttpServiceProvider,
        RoutingServiceProvider
    ]
}
