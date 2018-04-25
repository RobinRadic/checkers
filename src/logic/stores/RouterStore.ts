import { injectable } from 'inversify';
import { action, observable } from 'mobx';
import { Params, Router, State } from 'router5/create-router';
import { NavigationOptions } from 'router5/core/navigation';
import { transitionPath } from 'router5';


@injectable()
export class RouterStore {
    @observable route: State         = null;
    @observable previousRoute: State = null;
    @observable transitionRoute      = null;
    @observable transitionError      = null;
    @observable intersectionNode     = '';
    @observable toActivate           = [];
    @observable toDeactivate         = [];
    // @observable currentView;

    router: Router = null;


    setRouter(router) {
        this.router = router;
    }

    updateRoute(routeType, route) {
        this[ routeType ] = route;
    }

    resetRoute(routeType) {
        this[ routeType ] = null;
    }

    //  ===========
    //  = ACTIONS =
    //  ===========
    // These are called by the plugin
    @action onTransitionStart = (route, previousRoute) => {
        this.updateRoute('transitionRoute', route);
        this.transitionError = null;
    };

    @action onTransitionSuccess = (route, previousRoute, opts) => {
        this.updateRoute('route', route);
        this.updateRoute('previousRoute', previousRoute);
        if ( route ) {
            const { toActivate, toDeactivate, intersection } = transitionPath(route, previousRoute);
            this.intersectionNode                            = opts.reload ? '' : intersection;
            this.toActivate                                  = toActivate;
            this.toDeactivate                                = toDeactivate;
        }
        this.clearErrors();
    };

    @action onTransitionCancel = (route, previousRoute) => {
        this.resetRoute('transitionRoute');
    };

    @action onTransitionError = (route, previousRoute, transitionError) => {
        this.updateRoute('transitionRoute', route);
        this.updateRoute('previousRoute', previousRoute);
        this.transitionError = transitionError;
    };

    // These can be called manually
    @action clearErrors = () => {
        this.resetRoute('transitionRoute');
        this.transitionError = null;
    };


    // Public API, we can manually call these router methods
    // Note: These are not actions because they don't directly modify the state

    // Just an alias
    navigate = (name: string, params?: Params, opts?: NavigationOptions) => {
        this.router.navigate(name, params, opts);
    };

}



