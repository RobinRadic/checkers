import React, { Component, createElement } from 'react';
import { getComponent } from './utils';
import { Route } from './types';
import { State } from 'router5/create-router';

const log                                = require('debug')('router:view')
interface RouteViewProps {
    routes: Route[],
    routeNodeName: string
    route: State
}

/**
 * RouteView component: it should be used inside a routeNode component
 *
 * It select and render the correct component associated with the current route for the given routeNodeName
 *
 * @return {object|null}
 */
export class RouteView extends Component<RouteViewProps> {
    static displayName = 'RouteView';

    render() {
        const { route, routeNodeName, routes, ...passThroughProps } = this.props;
        let currentRoute                                            = route;

        if ( ! currentRoute ) {
            throw new Error('RouteView component requires a route prop');
        }
        const SelectedComponent = getComponent(currentRoute, routeNodeName, routes); // getComponent may throw
        log('RouteView render', {route, routeNodeName, routes, currentRoute,SelectedComponent})
        // Add `{key: route.meta.id}` to props for a full unmount/mount
        return createElement(SelectedComponent, { ...passThroughProps, route });
    }
}

interface RouteViewErrorBoundaryProps extends RouteViewProps {
    errorMessage?: string,
    errorStyle?: React.CSSProperties
}

export class RouteViewErrorBoundary extends Component<RouteViewErrorBoundaryProps> {
    static displayName = 'RootViewErrorBoundary'
    static defaultProps = {
        errorMessage: 'Something went wrong.',
        errorStyle  : { color: 'rgb(217, 83, 79)' }
    };
           state        = { hasError: false }

    componentWillReceiveProps(nextProps) {
        if ( this.props.routes !== nextProps.routes || this.props.routeNodeName !== nextProps.routeNodeName || this.props.route !== nextProps.route ) {
            this.setState({ hasError: false });
        }
    }

    componentDidCatch(error, info) {
        const currentRoute = this.props.route;
        // Display fallback UI
        this.setState({ hasError: true });

        console.error(`RouteView: it was not possible to select the correct view for the current route '${currentRoute.name}' having params: `);
        // This outputs an object on the browser console you can click through
        console.dir(currentRoute.params);
        console.log(error, info);
    }

    render() {
        if ( this.state.hasError ) {
            return <h1 style={this.props.errorStyle}>{this.props.errorMessage}</h1>;
        }
        const { errorMessage, errorStyle, ...passThroughProps } = this.props;
        return <RouteView {...passThroughProps} />;
    }
}
