import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { inject, Symbols } from '#/ioc';
import { AuthStore, RootStore, RouterStore } from '#/stores';
import { CSSModules, Hot } from 'decorators';
import { Affix, Layout, Menu } from 'antd';
import { Link } from '#/router';
import { Icon } from '@/Icon';
import styles from 'styles/styles.module.scss'
import { MenuProps } from 'antd/es/menu';
import RootNode from './nodes/RootNode';
import { cloneDeep } from 'lodash'


const { Header, Footer, Content } = Layout;
const log                         = require('debug')('component:Layout')

interface Props extends CSSModules.InjectedCSSModuleProps {}


const menuProps: MenuProps = {
    theme: 'dark',
    mode : 'horizontal',
    style: { lineHeight: '64px', float: 'right' }
}

@Hot(module)
@CSSModules(styles)
@observer
export default class RootView extends Component<Props> {
    static displayName = 'RootView'
    @inject(Symbols.RootStore) store: RootStore
    @inject(Symbols.AuthStore) authStore: AuthStore
    @inject(Symbols.RouterStore) routerStore: RouterStore

    render() {
        const { styles }          = this.props
        const year                = (new Date()).getFullYear()
        menuProps.selectedKeys    = [ this.routerStore.route.name ]
        const leftMenuProps       = cloneDeep(menuProps);
        leftMenuProps.style.float = 'left';
        return (
            <Layout styleName="layout">
                <Affix>
                    <Header styleName="header">

                        <Menu {...leftMenuProps}>
                            <Menu.Item key='home'><Link routeName='home'>Home</Link></Menu.Item>
                        </Menu>
                        {this.authStore.loggedIn ? this.renderLoggedInMenu() : this.renderMenu()}
                    </Header>
                </Affix>
                <Layout>
                    <Content>
                        <RootNode/>
                    </Content>
                </Layout>
                {/*<RouteView route={this.routerStore.route} routes={routes} routeNodeName=""/>;*/}
                <Footer>
                    Copyright <Icon name="copyright"/> {year} Robin Radic
                </Footer>
            </Layout>
        );
    }

    private renderMenu() {
        return (
            <Menu {...menuProps}>
                <Menu.Item key='user.login'><Link routeName='user.login'>Login</Link></Menu.Item>
                <Menu.Item key='user.register'><Link routeName='user.register'>Register</Link></Menu.Item>
            </Menu>
        )
    }

    private renderLoggedInMenu() {
        return (
            <Menu {...menuProps}>
                <Menu.Item key='game.create'><Link routeName='game.create'>Create</Link></Menu.Item>
                <Menu.Item key='game.join'><Link routeName='game.join'>Join</Link></Menu.Item>
                <Menu.Item key='user.logout'><Link routeName='user.logout'>Logout</Link></Menu.Item>
            </Menu>
        )
    }
}


