import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputSheet } from 'react-typestyle-preset';
import { StyleProps } from 'interfaces';
import { Hot, WithStyles } from 'decorators'
import { Layout, Menu } from 'antd';
import Fade from 'react-reveal/Fade';
import { hideAll } from 'react-reveal/globals';
import { HomeViewProps } from 'views/HomeView';

const log                                = require('debug')('components:home-content')
const { SubMenu, Item }                  = Menu;
const { Header, Content, Sider, Footer } = Layout;

log('Fade', { Fade })

interface HomeContentProps extends Partial<StyleProps> {}


@Hot(module)
@observer
@WithStyles()
export default class HomeContent extends Component<HomeContentProps> {
    static displayName                       = 'HomeContent';
    static styles: InputSheet<HomeViewProps> = {
        layout : { minHeight: '100vh' },
        content: {
            minHeight: 'calc(100vh - 130px)' // full height - header & footer height
        }
    }

    render() {
        window[ 'hideAll' ]          = hideAll;
        const year                   = (new Date()).getFullYear()
        const { classNames, styles } = this.props
        log('render', { classNames })
        return (
            <Layout>
                <Content className={classNames.content}>
                    Hello!
                </Content>
            </Layout>
        );
    }
}

