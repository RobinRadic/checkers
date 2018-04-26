import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Layout } from 'antd';
import { CSSModules, Hot } from 'decorators';
import styles from './views.module.scss'
import UIGame from '@/game/UIGame';

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
                <Content>
                    <UIGame/>
                </Content>
            </Layout>
        );
    }
}
