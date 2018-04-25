import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import { BreakpointStore, RouterStore } from 'stores';
import { CSSModules, Hot } from 'decorators';
import { Affix, Layout } from 'antd';
import { Link, RouteView } from 'router';
import { Icon } from '@/Icon';
import styles from './views.module.scss'
import { routes } from 'src/routes';


const { Header, Footer, Content } = Layout;
const log                         = require('debug')('component:Layout')

interface Props extends CSSModules.InjectedCSSModuleProps {}

interface State {}

@Hot(module)
@CSSModules(styles)
@observer
export default class RootView extends Component<Props, State> {
    static displayName = 'RootView'
    @inject(Symbols.BreakpointStore) store: BreakpointStore
    @inject(Symbols.RouterStore) routerStore: RouterStore

    render() {
        const { styles } = this.props
        const year       = (new Date()).getFullYear()
        return (
            <Layout styleName="layout">
                <Affix>
                    <Header styleName="header">
                        <Link routeName='game'>Game</Link>
                    </Header>
                </Affix>
                <RouteView route={this.routerStore.route} routes={routes} routeNodeName=""/>;
                <Footer>
                    Copyright <Icon name="copyright"/> {year} Robin Radic
                </Footer>
            </Layout>
        );
    }
}


