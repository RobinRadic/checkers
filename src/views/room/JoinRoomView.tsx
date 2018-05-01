import React, { Component, MouseEvent } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { Button, Col, Layout, List, Row } from 'antd';
import { inject, Symbols } from '#/ioc';
import { RoomStore, RouterStore } from '#/stores';
import { RoomData } from '#/api';
import { ListItemMetaProps, ListItemProps } from 'antd/es/list';

const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:game:JoinRoomView')

export interface JoinViewProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.NestedCSSProperties
    /** Optional className */
    className?: string;
}

/**
 * LoginView component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class JoinRoomView extends Component<JoinViewProps & CSSModules.InjectedCSSModuleProps> {
    static displayName: string         = 'JoinRoomView'
    static defaultProps: JoinViewProps = {
        style: {
            $nest: {
                '.ant-list-item'        : {
                    paddingBottom: 5
                },
                '.ant-list-item-content': {
                    marginBottom: 5
                },
                '.ant-list-item-main'   : {},
                '.ant-list-item-meta'   : {
                    marginBottom: 0
                }
            }
        }
    }

    @inject(Symbols.RoomStore) roomStore: RoomStore;
    @inject(Symbols.RouterStore) routerStore: RouterStore;

    handleJoinClick = (room:RoomData) => (e: MouseEvent<any>) => {
        e.preventDefault();
        this.roomStore
            .joinRoom(room.id)
            .then((r) => {
                this.routerStore.navigate('room.room')
            })
    };


    componentDidMount(): void {
        this.roomStore.fetchRooms()
    }

    render() {
        const { styles } = this.props;

        return (
            <Layout className={this.getClassName()}>
                <Content styleName='content'>
                    <Row>
                        <Col xs={{ span: 20, offset: 1 }} md={{ span: 6, offset: 9 }}>
                            <List
                                loading={this.roomStore.inProgress}
                                itemLayout="vertical"
                                dataSource={this.roomStore.rooms}
                                renderItem={(room: RoomData) => {
                                    let itemProps: ListItemProps = {
                                        extra  : <span>{room.players.length}/2 Players</span>,
                                        actions: room.is_full ? [] : [
                                            <Button
                                                type="primary"
                                                disabled={this.roomStore.inProgress}
                                                onClick={this.handleJoinClick(room)}
                                            >Join</Button> ]
                                    }
                                    let description              = <span/>
                                    if ( room.players.length ) {
                                        description = <div>Players in room: <ul className={styles[ 'room-list-player-list' ]}>{room.players.map(player => <li key={player.id}>{player.name}</li>)}</ul></div>
                                    }
                                    let metaProps: ListItemMetaProps = {
                                        title: room.name,
                                        description
                                    }

                                    return (
                                        <List.Item  {...itemProps} >
                                            <List.Item.Meta  {...metaProps} />
                                        </List.Item>
                                    )
                                }}
                            />
                        </Col>
                    </Row>
                </Content>
            </Layout>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
