import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputSheet } from 'react-typestyle-preset';
import { StyleProps } from 'interfaces';
import { CSSModules, Hot, WithStyles } from 'decorators'
import { Layout } from 'antd';

import styles from './views.module.scss'

const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:home')


export interface HomeViewProps extends StyleProps {}

@Hot(module)
@CSSModules(styles)
@observer
export default class HomeView extends Component<HomeViewProps & CSSModules.InjectedCSSModuleProps, {}> {

    static displayName                       = 'HomeView';
    static styles: InputSheet<HomeViewProps> = {
        content: {
            minHeight: 'calc(100vh - 130px)' // full height - header & footer height
        },
    }


    render() {
        const year                   = (new Date()).getFullYear()
        const { classNames, styles } = this.props
        log('render', { classNames })
        return (
            <Layout>
                <Content >
                    Hello!
                </Content>
            </Layout>
        );
    }
}

