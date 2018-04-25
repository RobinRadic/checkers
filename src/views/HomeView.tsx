import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputSheet } from 'react-typestyle-preset';
import { StyleProps } from 'interfaces';
import { Hot, WithStyles } from 'decorators'
import { Affix, Layout, Menu } from 'antd';
import { Icon } from '@/Icon';
import HomeContent from '@/HomeContent';


const { SubMenu, Item }                  = Menu;
const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:home')


export interface HomeViewProps extends StyleProps {}

@Hot(module)
@WithStyles()
@observer
export default class HomeView extends Component<HomeViewProps, {}> {

    static displayName                       = 'HomeView';
    static styles: InputSheet<HomeViewProps> = {
        layout        : { minHeight: '100vh' },
        header        : { padding: '0 20px', height: '65px' },
        headerMenu    : { float: 'right', lineHeight: '64px' },
        headerMenuIcon: { fontSize: '30px', margin: '15px 10px' }
    }

    static inlineStyles: InputSheet<HomeViewProps> = (props) => ({
        contentGutter: { padding: 20 },
        left         : { float: 'left' },
        right        : { float: 'right' }
    })


    render() {
        const year                   = (new Date()).getFullYear()
        const { classNames, styles } = this.props
        log('render', { classNames })
        return (
            <Layout className={classNames.layout}>

                <Affix>
                    <Header className={classNames.header}>
                    </Header>
                </Affix>
                <HomeContent/>
                <Footer>
                    Copyright <Icon name="copyright"/> {year} Robin Radic
                </Footer>
            </Layout>
        );
    }
}

