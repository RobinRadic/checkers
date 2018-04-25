import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { getDisplayName, ifNot } from './utils';
import { inject, Symbols } from 'ioc';
import { RouterStore } from 'stores';

/**
 * It creates and returns a new wrapper ComponentWithRoute around BaseComponent
 *
 * @param BaseComponent - the component to be wrapped
 * @param storeName - the mobx-router5 store instance name. Default 'routerStore'
 * @returns {ComponentWithRoute}
 */
function withRoute() {
    return (BaseComponent) => {
        @observer
        class ComponentWithRoute extends Component<any> {
            @inject(Symbols.RouterStore) routerStore: RouterStore

            get router() { return this.routerStore.router }

            static displayName = 'WithRoute[' + getDisplayName(BaseComponent) + ']';

            static defaultProps = {
                // Forwarded
                className      : '',
                routeParams    : {},
                // These won't be forwarded
                activeClassName: 'active',
                activeStrict   : false
            };

            static computeClassName(className, activeClassName, isActive) {
                return (className ? className.split(' ') : [])
                    .concat(isActive ? [ activeClassName ] : []).join(' ');
            }

            isActive(routeName, routeParams, activeStrict) {
                return this.router.isActive(routeName, routeParams, activeStrict);
            }

            render() {
                ifNot(
                    ! this.props.route,
                    '[react-mobx-router5][withRoute] prop names `route` is reserved.'
                );

                // Don't forward these
                const { activeStrict, activeClassName, ...passThroughProps } = this.props;
                const { routeName, routeParams, className }                  = passThroughProps;

                let currentClassName = className;
                let isActive         = null;
                if ( routeName ) {
                    isActive         = this.isActive(routeName, routeParams, activeStrict);
                    currentClassName = ComponentWithRoute.computeClassName(className, activeClassName, isActive);
                }

                // De-referencing a mobx-observable will trigger a re-rendering (because of the @observer)
                const { route } = this.routerStore;
                const newProps  = {
                    ...passThroughProps,
                    isActive,
                    className  : currentClassName,
                    // routerStore: this.routerStore,
                    route
                };

                // return React.createElement('a', newProps, passThroughProps.children);

                return React.cloneElement(<BaseComponent />, {
                    ...newProps
                }, passThroughProps.children)
                // return (
                //     <BaseComponent {...newProps} >
                //         {passThroughProps.children}
                //     </BaseComponent>
                // )

            }
        }

        return ComponentWithRoute as any;
    }
}

export default withRoute;
