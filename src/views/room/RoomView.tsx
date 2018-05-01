import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { Col, Layout, Row, Spin } from 'antd';
import { inject, Symbols } from '#/ioc';
import { RoomStore } from '#/stores';

const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:game:CreateRoomView')

export interface RoomViewProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

/**
 * LoginView component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class RoomView extends Component<RoomViewProps & CSSModules.InjectedCSSModuleProps> {
    static displayName: string         = 'RoomView'
    static defaultProps: RoomViewProps = {}
    @inject(Symbols.RoomStore) roomStore: RoomStore

    componentWillUnmount(): void {
        this.roomStore.leaveRoom();
    }

    render() {
        // const {} = this.props;
        const { room } = this.roomStore
        return (
            <Layout className={this.getClassName()}>
                <Content styleName='content'>
                     <Row>
                         <Col xs={{ span: 20, offset: 1 }} md={{ span: 6, offset: 9 }}>
                             <h2>Room: {room.name}</h2>
                         </Col>
                     </Row>
                </Content>
            </Layout>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
