import * as React from 'react';
import { Route, routeNode, RouteView } from 'router';
import { inject, Symbols } from 'ioc';
import { State } from 'router5/create-router';
import { hot } from 'react-hot-loader';

const routeNodeName = 'home';

@routeNode(routeNodeName)
class HomeNode extends React.Component<{ route: State }, {}> {
    static displayName = 'HomeNode'

    @inject(Symbols.routes) routes: Route[]

    render() {
        const { route } = this.props;
        return <RouteView route={route} routes={this.routes} routeNodeName={routeNodeName}/>;
    }
}


export default hot(module)(HomeNode);
