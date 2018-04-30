import * as React from 'react';
import { Route, routeNode, RouteView, State } from '#/router';
import { inject, Symbols } from '#/ioc';
import { Hot } from 'decorators';

const log = require('debug')('views:nodes:root')

const routeNodeName = 'game';

interface Props {
    route?: State
}

@Hot(module)
@routeNode(routeNodeName)
export default class RootNode extends React.Component<Props> {
    static displayName = 'RootNode'
    @inject(Symbols.routes) routes: Route[]

    render() {
        const { route } = this.props
        log('render', { me: this, route })
        return (
            <RouteView route={route} routes={this.routes} routeNodeName={routeNodeName}/>
        )
    }
}
