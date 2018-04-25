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

            get router() {return this.routerStore.router}

            state = {
                route: this.routerStore.route
            };

            autorunDisposer
            nodeName

            // Compute a new observable used by autorun
            @computed get isIntersection() {
                return this.routerStore.intersectionNode === this.nodeName;
            }

            componentDidMount() {
                log('componentDidMount', {me:this})
                this.autorunDisposer = autorun(() => {
                    log('componentDidMount', 'autorun', 'isIntersection', this.isIntersection, {me:this})
                    // Change state only if this is the correct "transition node" for the current transition
                    // This will re-render this component and so the wrapped RouteSegment component
                    if ( this.isIntersection ) {
                        this.setState({
                            route: this.routerStore.route
                        });
                    }
                });
            }

            componentWillUnmount() {
                this.autorunDisposer();
            }

            render() {
                log('render', {me:this})
                const { route }  = this.routerStore;
                const plainRoute = toJS(route); // convert to plain object
                return createElement(RouteComponent, { ...this.props, route, plainRoute });
            }
        }

        return RouteNode as any;
    };
}

export default routeNode;
