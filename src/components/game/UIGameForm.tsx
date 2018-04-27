import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Input, Select } from 'antd';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { inject, Symbols } from '#/ioc';
import { AbstractGame } from '#/game';
import { GameStore } from '#/stores';
import { action, computed, observable } from 'mobx';
import { Step, Transition } from 'semantic-ui-react'
import 'semantic-ui-less/definitions/modules/transition.less'
import 'semantic-ui-less/definitions/elements/step.less'
import { GameMode } from 'interfaces';

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
    static displayName: string                    = 'UIGameForm'
    static defaultProps: Partial<UIGameFormProps> = {}
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

    @observable showFields: string[] = [ 'mode' ]
    @observable step: string         = 'mode'

    @action setStep(step: string) {this.step = step}

    render() {
        let transitionDuration = 500;
        return (
            <div className={this.getClassName()}>
                <Step.Group widths={3} size='mini'>
                    <Step active={this.step === 'mode'} disabled={this.step !== 'mode'}>
                        <Step.Content> <Step.Title>Game Mode</Step.Title> </Step.Content>
                    </Step>
                    <Step active={this.step === 'name'} disabled={this.step !== 'name'}>
                        <Step.Content> <Step.Title>Player Name</Step.Title> </Step.Content>
                    </Step>
                    <Step active={this.step === 'confirm'} disabled>
                        <Step.Content> <Step.Title>Confirm</Step.Title> </Step.Content>
                    </Step>
                </Step.Group>
                <Transition visible={this.step === 'mode'} animation="slide down" duration={transitionDuration}>
                    <div>
                        <Select
                            placeholder="Select a game mode"
                            style={{ width: '70%' }}
                            value={this.store.mode}
                            onChange={(v: GameMode) => this.store.setMode(v)}
                        >
                            <Option value="free">Free Play</Option>
                            <Option value="singleplayer">vs CPU (singleplayer)</Option>
                            <Option value="multiplayer">vs Human (multiplayer)</Option>
                        </Select>
                        <Button
                            type="primary"
                            style={{ marginLeft: 10 }}
                            onClick={() => {
                                this.setStep(null)
                                setTimeout(() => this.setStep('name'), transitionDuration);
                            }}
                        >Next</Button>
                    </div>
                </Transition>
                <Transition visible={this.step === 'name'} animation="slide down" duration={transitionDuration}>
                    <div>
                        <Input
                            placeholder="Your name"
                            style={{ width: '70%' }}
                            value={this.store.playerName}
                            onChange={(v) => this.store.setPlayerName(v.target.value)}
                        />
                        <Button
                            type="primary"
                            style={{ marginLeft: 10 }}
                            onClick={() => {
                                this.setStep(null)
                                setTimeout(() => this.setStep('confirm'), transitionDuration);
                            }}
                        >Next</Button>
                    </div>
                </Transition>
                <Transition visible={this.step === 'confirm'} animation="slide down" duration={transitionDuration}>
                    <div>
                        <Button type="primary" onClick={() => {
                            this.store.createGame();
                            this.store.startGame();
                        }}>Start Game</Button>

                        <Button type="primary" onClick={() => {
                            this.store.setMode(null)
                            this.store.setPlayerName(null)
                            this.setStep('mode');
                        }}>Reset</Button>
                    </div>
                </Transition>

            </div>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}

// export default hot(module)(Form.create({
//     onFieldsChange(props, fields: Array<any>) {
//         log('onFieldsChange', { props, fields })
//     },
//     onValuesChange(props, values: any) {
//         log('onValuesChange', { props, values })
//     }
// })(UIGameForm))
