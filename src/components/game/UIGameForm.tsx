import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Select } from 'antd';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { inject, Symbols } from '#/ioc';
import { AbstractGame } from '#/game';
import { GameStore } from '#/stores';
import { computed } from 'mobx';

const log        = require('debug')('components:UIGameForm')
const { Option } = Select;

export interface UIGameFormProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

/**
 * UIGameForm component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class UIGameForm extends Component<UIGameFormProps & CSSModules.InjectedCSSModuleProps> {
    static displayName: string           = 'UIGameForm'
    static defaultProps: UIGameFormProps = {}
    @inject(Symbols.GameStore) store: GameStore

    @computed get game(): AbstractGame { return this.store.game }


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
        this.game.board.getTile(1, 0).occupant.king()
        this.game.board.getTile(6, 0).occupant.king()
        this.game.emit('update')
    }
    onRestartClick = (e) => {
        log('onRestartClick', e, { me: this });
        this.game.endGame()
        this.game.startGame()
    }
    onStartClick   = (e) => {
        log('onStartClick', e, { me: this });
        this.store.createGame();
        this.store.startGame();
    }
    onSelectChange = (value) => {
        log('onSelectChange', value, { me: this });
        this.store.setMode(value);
    }

    render() {
        // const {} = this.props;
        return (
            <div className={this.getClassName()}>

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
                    disabled={this.store.mode === null}
                    type="primary"
                    onClick={this.onStartClick}
                >Start</Button>


                {DEV ? <Button
                    style={{ marginBottom: 10 }}
                    disabled={this.store.mode === null}
                    type="primary"
                    onClick={this.onRestartClick}
                >Restart</Button> : null}
                {DEV ? <Button
                    style={{ marginBottom: 10 }}
                    disabled={! this.game}
                    type="primary"
                    onClick={this.onDevClick}
                >DEV</Button> : null}
            </div>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
