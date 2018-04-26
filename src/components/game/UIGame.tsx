import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { classes, style, types } from 'typestyle'
import { Col, Row } from 'antd';
import { Pusher } from 'pusher-js';
import { postConstruct } from 'inversify';

import { CSSModules, Hot } from 'decorators';
import { inject, Symbols } from '#/ioc';
import UIBoard from '@/game/UIBoard';
import UIGameForm from '@/game/UIGameForm';
import { GameStore } from '#/stores';

import styles from 'styles/styles.module.scss'

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

    // @inject(Symbols.Echo) echo:Echo
    @inject(Symbols.Pusher) pusher: Pusher

    @postConstruct()
    postConstruct() {
        this.pusher.connect();
        this.pusher.subscribeAll();
        log('postConstruct', { pusher: this.pusher })
        window[ 'pusher' ] = this.pusher
    }

    render() {
        // const {} = this.props;
        return (
            <Row type="flex" justify="start" className={this.getClassName()}>
                <Col xs={24} md={6} style={{ padding: 10 }}>
                    <UIGameForm/>
                </Col>
                <Col xs={24} md={12}>
                    {this.store.game ? <UIBoard game={this.store.game}/> : null}
                </Col>
                <Col xs={24} md={6}/>
            </Row>
        )
    }

    getClassName() {
        return classes(style(this.props.style), this.props.className);
    }
}
