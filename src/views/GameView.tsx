import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Layout, Row } from 'antd';
import { Hot } from 'decorators';
import UIBoard from '@/game/UIBoard';
import { Color, Direction, Game, HumanPlayer } from 'game';
import { style } from 'typestyle';


const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:home')

export interface GameViewProps extends React.CSSProperties {}


@Hot(module)
@observer
export default class GameView extends Component<GameViewProps, {}> {
    static displayName = 'GameView';
           game: Game;

    constructor(props = {}, ctx) {
        super(props, ctx);
        this.game     = new Game();
        const player1 = new HumanPlayer(this.game, Color.BLACK, Direction.SOUTH);
        const player2 = new HumanPlayer(this.game, Color.WHITE, Direction.NORTH);

        this.game.addPlayers(player1, player2);
        this.game.startGame();

        player1.pieces[ 0 ].king();

        log('GAME', this.game)
    }

    render() {
        return (
            <Layout className={style({ height: '100vh' })}>
                <Header>Header</Header>
                <Layout>
                    <Content>
                        <Row type="flex" justify="start">
                            <Col xs={24} md={6}/>
                            <Col xs={24} md={12}><UIBoard game={this.game}/></Col>
                            <Col xs={24} md={6}/>
                        </Row>

                    </Content>
                </Layout>
                <Footer>Footer</Footer>
            </Layout>

        );
    }
}
