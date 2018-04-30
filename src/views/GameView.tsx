import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import styles from 'styles/styles.module.scss'
import UIGame from '@/game/UIGame';
import { Layout } from 'antd';

const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:home')

export interface GameViewProps extends React.CSSProperties {}


@Hot(module)
@CSSModules(styles)
@observer
export default class GameView extends Component<GameViewProps & CSSModules.InjectedCSSModuleProps, {}> {
    static displayName = 'GameView';

    render() {
        return (
            <Layout>
                <Content styleName='content'>
                    <UIGame/>
                </Content>
            </Layout>
        );
    }
}
