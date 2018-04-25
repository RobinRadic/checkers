import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Layout, Row, Select } from 'antd';
import { CSSModules, DNDContext, Hot } from 'decorators';
import './PyroView.scss'
import styles from './PyroView.module.scss'
import UIBoard from '@/checkers/UIBoard';
import { Color, Direction, Game, HumanPlayer } from '@/checkers/logic';

import HTML5Backend from 'react-dnd-html5-backend';


const { Header, Content, Sider, Footer } = Layout;
const log                                = require('debug')('views:home')
const { Option }                         = Select

export interface PyroViewProps extends React.CSSProperties {}



@Hot(module)
// @DNDContext(HTML5Backend)
@CSSModules(styles)
@observer
export default class PyroView extends Component<PyroViewProps, {}> {
    game: Game;
    static displayName = 'PyroView';


    constructor(props = {}, ctx) {
        super(props, ctx);
        this.game     = new Game();
        const player1 = new HumanPlayer(this.game, Color.BLACK, Direction.SOUTH);
        const player2 = new HumanPlayer(this.game, Color.WHITE, Direction.NORTH);

        this.game.addPlayers(player1, player2);
        this.game.startGame();

        player1.pieces[0].king();

        log('GAME', this.game)
    }

    renderGridViewTable() {
        let data = this.game.board;
        let a    = (
            <table styleName="gvt-table">
                <tbody>
                {this.game.board.tiles.map((row, irow) => <tr key={irow} styleName="gvt-row">{row.map((cell, icell) =>
                    <td key={icell} styleName="gvt-cell"><span styleName="gvt-info">y:{irow} x:{icell}</span><span styleName="gvt-value">{cell ? cell.toString() : 'empty'}</span></td>)}</tr>)}
                </tbody>
            </table>
        )
        return a;
    }

    render() {
        return (
            <Layout styleName="layout">
                <Header>Header</Header>
                <Layout>
                    <Content>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                {this.renderGridViewTable()}
                            </Col>
                            <Col span={8}>
                                <UIBoard game={this.game}/>
                            </Col>
                            <Col span={8}>
                                {/*<Board size={8} />*/}
                            </Col>
                        </Row>

                    </Content>
                </Layout>
                <Footer>Footer</Footer>
            </Layout>

        );
    }
}
