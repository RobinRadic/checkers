import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { inject, Symbols } from '#/ioc';
import { computed, observable, runInAction, toJS } from 'mobx';
import { GameStore } from '#/stores';
import { AbstractGame } from '#/game';
import Axios from 'axios';
import { Col, Row } from 'antd'

const Echo = require('laravel-echo');
const log  = require('debug')('components:UIChat')

export interface UIChatProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

interface IMessage {
    sender_name: string
    sender_ip: string
    message: string
}

/**
 * UIChat component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class UIChat extends Component<UIChatProps & CSSModules.InjectedCSSModuleProps> {
    static displayName: string       = 'UIChat'
    static defaultProps: UIChatProps = {}

    @inject(Symbols.GameStore) store: GameStore

    @computed get game(): AbstractGame { return this.store.game }

    @inject(Symbols.Echo) echo: typeof Echo

    @observable messages: IMessage[] = [];

    getJSMessages(): IMessage[] {return toJS(this.messages)};

    constructor(props: UIChatProps & CSSModules.InjectedCSSModuleProps, context: any) {
        super(props, context);
        log(this)
        window[ 'chat' ] = this;
        this.getMessages();
    }

    getMessages() {
        Axios.get('http://checkers.local/game/messages').then(response => {
            log('getMessages', response.data)
            runInAction(() => this.messages = response.data)
        })

    }

    addMessage(message: string) {
        Axios.post('http://checkers.local/game/messages', { name: this.store.playerName, message }).then(res => {
            log(res.data)
        })
    }

    render() {
        // const {} = this.props;
        return (
            <div className={this.getClassName()}>
                <div>
                    {this.messages.map((message, imessage) => (
                        <Row key={imessage}>
                            <Col span={6}>From: {message.sender_name}</Col>
                            <Col span={18}>Message: {message.message}</Col>
                        </Row>
                    ))}
                </div>
            </div>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
