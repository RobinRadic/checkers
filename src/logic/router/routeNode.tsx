import { Component, createElement } from 'react';
import { getDisplayName } from './utils';
import { autorun, computed, toJS } from 'mobx';
import { inject, Symbols } from 'ioc';
import { RouterStore } from 'stores';
import { observer } from 'mobx-react';

const log = require('debug')('router:node')

function routeNode(nodeName) { // route node Name, routerStore name
    return (RouteComponent) => { // component Name

        @observer
        class RouteNode extends Component<any> {
            static displayName = 'RouteNode[' + getDisplayName(RouteComponent) + ']';

            @inject(Symbols.RouterStore) routerStore: RouterStore

            autorunDisposer
            nodeName

            get router() {return this.routerStore.router}

            @computed get route() { return this.routerStore.route }

            @computed get intersectionNode() { return this.routerStore.intersectionNode }

            // Compute a new observable used by autorun
            @computed get isIntersection() { return this.intersectionNode === this.nodeName; }

            componentDidMount() {
                log('componentDidMount', { me: this })
                this.autorunDisposer = autorun(() => {
                    log('componentDidMount', 'autorun', 'isIntersection', this.isIntersection, { me: this })
                    // Change state only if this is the correct "transition node" for the current transition
                    // This will re-render this component and so the wrapped RouteSegment component
                    if ( this.isIntersection ) {
                        // this.setState({
                        //     route: this.route
                        // });
                    }
                });
            }

            componentWillUnmount() {
                this.autorunDisposer();
            }

            render() {
                log('render', { me: this })
                const route      = this.route;
                const plainRoute = toJS(route); // convert to plain object
                return createElement(RouteComponent, { ...this.props, route, plainRoute });
            }
        }

        return RouteNode as any;
    };
}

export default routeNode;
