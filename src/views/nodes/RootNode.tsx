import * as React from 'react';
import { Link, Route, routeNode, RouteView, State } from '#/router';
import { inject, Symbols } from '#/ioc';
import { CSSModules, Hot } from 'decorators';
import { Affix, Layout } from 'antd';
import { Icon } from '@/Icon';
import styles from '../views.module.scss'

const { Header, Footer, Content } = Layout;
const log                         = require('debug')('views:nodes:root')

const routeNodeName = '';

interface Props extends CSSModules.InjectedCSSModuleProps {
    route?: State
}

@Hot(module)
@routeNode(routeNodeName)
@CSSModules(styles)
export default class RootNode extends React.Component<Props> {
    static displayName = 'RootNode'
    @inject(Symbols.routes) routes: Route[]

    render() {
        const { route, styles } = this.props
        const year              = (new Date()).getFullYear()
        log('render', { me: this, route, styles })
        return (
            <Layout styleName="layout">
                <Affix>
                    <Header styleName="header">
                        <Link routeName='game'>Game</Link>
                    </Header>
                </Affix>
                <RouteView route={route} routes={this.routes} routeNodeName={routeNodeName}/>;
                <Footer>
                    Copyright <Icon name="copyright"/> {year} Robin Radic ${routeNodeName}
                </Footer>
            </Layout>
        )
        // return <RouteView route={route} routes={this.routes} routeNodeName={routeNodeName}/>;
    }
}
