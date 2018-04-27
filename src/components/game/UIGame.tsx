import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Button, Col, Row } from 'antd';
import { classes, style, types } from 'typestyle'
import { Transition } from 'semantic-ui-react'
import 'semantic-ui-less/definitions/modules/transition.less'

import { CSSModules, Hot } from 'decorators';
import { inject, Symbols } from '#/ioc';
import UIBoard from '@/game/UIBoard';
import UIGameForm from '@/game/UIGameForm';
import { GameStore } from '#/stores';

import styles from 'styles/styles.module.scss'
import { computed } from 'mobx';
import { AbstractGame } from '#/game';
import UIGameDetails from '@/game/UIGameDetails';
import UIChat from '@/game/UIChat';

const Echo = require('laravel-echo');

const log = require('debug')('components:UIGame')

export interface UIGameProps extends CSSModules.InjectedCSSModuleProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

/**
 * UIGame component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class UIGame extends Component<UIGameProps> {
    static displayName: string       = 'UIGame'
    static defaultProps: UIGameProps = {}
    @inject(Symbols.GameStore) store: GameStore

    @computed get game(): AbstractGame { return this.store.game }

    @inject(Symbols.Echo) echo: typeof Echo


    // constructor(props, ctx) {
    //     super(props,ctx)
    //     this.echo
    //         .channel('game')
    //         .listen('MovedPiece', (e) => {
    //
    //         })
    // }

    render() {
        log('render', { echo: this.echo })
        // window[ 'pusher' ] = this.pusher;
        window[ 'uigame' ] = this;
        window[ 'echo' ] = this.echo;
        // const {} = this.props;
        return (
            <Row type="flex" justify="start" className={this.getClassName()}>
                <Col xs={24} md={6} style={{ padding: 10 }}>
                    {this.game && this.game.started ? null : <UIGameForm/>}
                    <Transition visible={DEV && this.game && this.game.started} animation="fade" duration={500}>
                        {this.renderDevButtons()}
                    </Transition>
                </Col>
                <Col xs={24} md={12}>
                    <Transition visible={this.game && this.game.started} animation="fade" duration={1500}>
                        <UIBoard/>
                    </Transition>
                </Col>
                <Col xs={24} md={6}>
                    <Transition visible={this.game && this.game.started} animation="fade" duration={1500}>
                        <div>
                            <UIGameDetails/>
                            {this.store.mode === 'multiplayer' ? <UIChat/> : null}
                        </div>
                    </Transition>
                </Col>
            </Row>
        )
    }

    startMulti(){
        this.store.setMode('multiplayer')
        this.store.setPlayerName('player' + Math.ceil(Math.random() * 2333))
        this.store.createGame()
        this.store.startGame()
        this.forceUpdate()
    }

    onDevClick = (e) => {
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
        this.game.board.getTile(1, 0).occupant.king()
        this.game.board.getTile(6, 0).occupant.king()
        this.game.emit('update')
    }

    onRestartClick = (e) => {
        log('onRestartClick', e, { me: this });
        this.game.endGame()
        this.game.startGame()
    }

    renderDevButtons() {
        return (
            <div>
                <Button
                    style={{ margin: '10px 0', display: 'block' }}
                    disabled={this.store.mode === null}
                    type="primary"
                    onClick={this.onRestartClick}
                >DEV Restart</Button>
                <Button
                    style={{ marginBottom: 10, display: 'block' }}
                    disabled={! this.game}
                    type="primary"
                    onClick={this.onDevClick}
                >DEV Test</Button>
            </div>
        )
    }


    getClassName() {
        return classes(style(this.props.style), this.props.className);
    }
}
