import * as React from 'react';
import { Route, routeNode, RouteView, State } from 'router';
import { inject, Symbols } from 'ioc';
import { hot } from 'react-hot-loader';

const routeNodeName = '';

@routeNode(routeNodeName)
class RootNode extends React.Component<{ route?: State }, {}> {
    static displayName = 'RootNode'
    @inject(Symbols.routes) routes: Route[]

    render() {
        const { route } = this.props;
        return <RouteView route={route} routes={this.routes} routeNodeName={routeNodeName}/>;
    }
}


export default hot(module)(RootNode);
