import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CSSModules, Hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import styles from 'styles/styles.module.scss'
import { inject, Symbols } from '#/ioc';
import { computed } from 'mobx';
import { GameStore } from '#/stores';
import { AbstractGame } from '#/game';

const log = require('debug')('components:UIGameDetails')

export interface UIGameDetailsProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
}

/**
 * UIGameDetails component
 */
@Hot(module)
@CSSModules(styles)
@observer
export default class UIGameDetails extends Component<UIGameDetailsProps & CSSModules.InjectedCSSModuleProps> {
    static displayName: string              = 'UIGameDetails'
    static defaultProps: UIGameDetailsProps = {}

    @inject(Symbols.GameStore) store: GameStore

    @computed get game(): AbstractGame { return this.store.game }

    render() {
        // const {} = this.props;
        return (
            <div className={this.getClassName()}>
                <div>Hello </div>
            </div>
        )
    }

    getClassName() { return classes(style(this.props.style), this.props.className); }
}
