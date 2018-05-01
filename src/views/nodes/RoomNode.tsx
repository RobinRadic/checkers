import * as React from 'react';
import { Route, routeNode, RouteView, State } from '#/router';
import { inject, Symbols } from '#/ioc';
import { Hot } from 'decorators';

const log = require('debug')('views:nodes:room')

const routeNodeName = 'room';

interface Props {
    route?: State
}

@Hot(module)
@routeNode(routeNodeName)
export default class RoomNode extends React.Component<Props> {
    static displayName = 'RoomNode'
    @inject(Symbols.routes) routes: Route[]

    render() {
        const { route } = this.props
        log('render', { me: this, route })
        return (
            <RouteView route={route} routes={this.routes} routeNodeName={routeNodeName}/>
        )
    }
}
