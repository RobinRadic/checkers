import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Layout, Row, Select } from 'antd';
import { CSSModules, DNDContext, Hot } from 'decorators';
import UIBoard from '@/checkers/UIBoard';
import { Color, Direction, Game, HumanPlayer } from '@/checkers/logic';


const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:home')
const { Option }                         = Select

export interface PyroViewProps extends React.CSSProperties {}


@Hot(module)
@observer
export default class CheckersView extends Component<PyroViewProps, {}> {
    static displayName = 'CheckersView';
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
            <Layout styleName="layout">
                <Header>Header</Header>
                <Layout>
                    <Content>
                        <Row type="flex" justify="start">
                            <Col span={6}/>
                            <Col span={12}><UIBoard game={this.game}/></Col>
                            <Col span={6}/>
                        </Row>

                    </Content>
                </Layout>
                <Footer>Footer</Footer>
            </Layout>

        );
    }
}
