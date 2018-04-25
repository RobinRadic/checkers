import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Col, Layout, Row, Select } from 'antd';
import { CSSModules, Hot } from 'decorators';
import UIBoard from '@/game/UIBoard';
import { Color, CPUPlayer, Direction, Game, HumanPlayer, IPlayer, RemotePlayer } from 'game';
import styles from './views.module.scss'
import { action, observable } from 'mobx';

const { Header, Content, Sider, Footer } = Layout;
const { Option }                         = Select;
const log                                = require('debug')('views:home')

export interface GameViewProps extends React.CSSProperties {}


export type GameMode = 'free' | 'singleplayer' | 'multiplayer'


@Hot(module)
@CSSModules(styles)
@observer
export default class GameView extends Component<GameViewProps & CSSModules.InjectedCSSModuleProps, {}> {
    static displayName = 'GameView';

    @observable mode: GameMode = null

    @action setMode(mode: GameMode) { this.mode = mode }

    @observable game: Game;

    @action
    protected startGame() {
        this.game = new Game();
        let player1: IPlayer;
        let player2: IPlayer;

        if ( this.mode === 'free' ) {
            player1 = new HumanPlayer(this.game, Color.BLACK, Direction.SOUTH);
            player2 = new HumanPlayer(this.game, Color.WHITE, Direction.NORTH);
        } else if ( this.mode === 'singleplayer' ) {
            player1 = new HumanPlayer(this.game, Color.BLACK, Direction.SOUTH);
            player2 = new CPUPlayer(this.game, Color.WHITE, Direction.NORTH);
        } else if ( this.mode === 'multiplayer' ) {
            player1 = new HumanPlayer(this.game, Color.BLACK, Direction.SOUTH);
            player2 = new RemotePlayer(this.game, Color.BLACK, Direction.SOUTH);
        }

        this.game.addPlayers(player1, player2);

        this.game.startGame();

        log('GAME', this.game)
    }

    onDevClick     = (e) => {
        log('onDevClick', e, { me: this });
        const moveTo = (row, col, trow, tcol) => {
            let from = this.game.board.getTile(row, col);
            let to   = this.game.board.getTile(trow, tcol);
            to.setOccupant(from.occupant);
            from.setOccupant(null);
        }
        moveTo(1, 1, 5, 1)
        moveTo(1, 3, 5, 3)
        moveTo(1, 5, 5, 5)
        this.game.board.getTile(1,0).occupant.king()
        this.game.board.getTile(6,0).occupant.king()
        this.game.emit('update')
    }
    onRestartClick = (e) => {
        log('onRestartClick', e, { me: this });
        this.game.endGame()
        this.game.startGame()
    }
    onStartClick   = (e) => {
        log('onStartClick', e, { me: this });
        this.startGame();
    }
    onSelectChange = (value) => {
        log('onSelectChange', value, { me: this });
        this.setMode(value);
    }

    render() {
        return (
            <Layout>
                <Content>
                    <Row type="flex" justify="start">
                        <Col xs={24} md={6} style={{ padding: 10 }}>
                            <Select
                                style={{ marginBottom: 10, width: '100%' }}
                                placeholder="Select a game mode"
                                onChange={this.onSelectChange}

                            >
                                <Option value="free">Free Play</Option>
                                <Option value="singleplayer">vs CPU (singleplayer)</Option>
                                <Option value="multiplayer">vs Human (multiplayer)</Option>
                            </Select>
                            <Button
                                style={{ marginBottom: 10 }}
                                disabled={this.mode === null}
                                type="primary"
                                onClick={this.onStartClick}
                            >Start</Button>

                            {DEV ? <Button
                                style={{ marginBottom: 10 }}
                                disabled={this.mode === null}
                                type="primary"
                                onClick={this.onRestartClick}
                            >Restart</Button> : null}
                            {DEV ? <Button
                                style={{ marginBottom: 10 }}
                                disabled={! this.game}
                                type="primary"
                                onClick={this.onDevClick}
                            >DEV</Button> : null}
                        </Col>
                        <Col xs={24} md={12}>{this.game ? <UIBoard game={this.game}/> : null}</Col>
                        <Col xs={24} md={6}/>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
