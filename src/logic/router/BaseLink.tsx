import React, { Component } from 'react';
import { inject, Symbols } from '#/ioc';
import { RouterStore } from '#/stores';
import { Route } from 'router5/create-router';
import autobind from 'autobind-decorator';

// TODO: make the storeName customizable
const storeName = 'routerStore';

interface BaseLinkProps {
    routeParams?: object,
    routeOptions?: object,
    routeName: string,  // not required because onClick could be passed instead
    onClick?: Function,
    className?: string,  // could be passed directly or forwarded (computed) from withRoute/withLink
    children?: React.ReactNode,
    dangerouslySetInnerHTML?: object,
    route?: Route
    isActive?: boolean
}

/**
 * BaseLink component: it generates an anchor element with href computed from props.routeName.
 *
 * This component won't re-render on route change
 *
 * The props `router` or `routerStore` (if decorated with @inject) are required only if props `routeName` is also passed.
 * If props `onClick` is passed then the navigation won't happen and the callback will be executed instead.
 *
 * Usage:
 * `<BaseLink
 *    router={routerInstance}         // optional/required: when we don't inject the routerStore then we need to pass the router explicitly.
 *                                    // If we don't use navigation then it's not required.
 *    routerStore={routerStore}       // optional/required: as above but could be @inject-ed or passed as prop
 *    onClick={onClickCB}             // optional, when passed the navigation will be prevented and the onClickCB will be executed instead
 *    routeName="home"                // optional/required: route to navigate to. When onClick is passed we don't need it
 *    routeParams={routeParamsObj}    // optional, default {}
 *    routeOptions={routeOptionsObj}  // optional, default {}
 */
class BaseLink extends Component<BaseLinkProps> {
    static displayName = 'BaseLink';

    static defaultProps = {
        routeParams : {},
        routeOptions: {}
    };

    @inject(Symbols.RouterStore) routerStore: RouterStore

    get router() {return this.routerStore.router}

    buildUrl(routeName, routeParams) {
        let url = '#';
        if ( routeName && this.router ) {
            // If browser plugin is active
            if ( this.router.buildUrl ) {
                url = this.router.buildUrl(routeName, routeParams);
            }
            else url = this.router.buildPath(routeName, routeParams);
        }
        return url;
    }


    @autobind
    clickHandler(evt) {
        // If props onClick is passed it will be executed
        // instead of navigating to the route
        if ( this.props.onClick ) {
            this.props.onClick(evt);

            if ( evt.defaultPrevented ) {
                return;
            }
        }

        const comboKey = evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey;

        if ( evt.button === 0 && ! comboKey ) {
            evt.preventDefault();
            this.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
        }
    }

    render() {
        // Don't add these to the 'a' element
        let { routeParams, routeOptions, routeName, onClick, route, isActive, ...passThroughProps } = this.props;

        // Computed props to add to 'a'
        const href     = this.buildUrl(routeName, routeParams);
        onClick        = this.clickHandler;
        const newProps = { ...passThroughProps, href, onClick };

        return React.createElement('a', newProps, passThroughProps.children);
    }
}

export default BaseLink;
